import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReservationService } from '../reservation.service';
import { ProductService } from '../../product/product.service';
import { ICommunity, IProduct, IReservation, IUser } from '@sharemunity-workspace/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';


@Component({
  selector: 'sharemunity-workspace-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css',
})
export class ReservationFormComponent implements OnInit {
  @Output() closePop = new EventEmitter<void>();
  @Input({required:false}) updateReservation:IReservation | null = null;   
  private readonly SAVED_DATA = 'savedData';

  reservationForm!: FormGroup;
  reservationService: ReservationService;
  productService: ProductService;
  authService:AuthenticationService;

  protected product: IProduct | null = null;
  protected loggedInUser: IUser | null = null;

  constructor(resService: ReservationService, prodService: ProductService,authenticationService:AuthenticationService, private activatedRoute:ActivatedRoute, private route:Router) {
    this.reservationService = resService;
    this.productService = prodService;
    this.authService = authenticationService;
  }

  ngOnInit(): void {
    console.log("Reservation form, -----------------");
    console.log(this.updateReservation);
    this.authService.user$.subscribe((user)=>{
      this.loggedInUser = user;
    });

    this.activatedRoute.paramMap.subscribe((params)=>{
      let id = params.get('id');
      this.productService.read(id).subscribe((prod) => {
        this.product = prod;
      });
    });

    this.reservationForm = new FormGroup({
      message: new FormControl(null, [Validators.required]),
      pickup_date: new FormControl(null, [Validators.required]),
    });

    if(this.updateReservation){
      const date = new Date(this.updateReservation.pickup_date);
      const formattedDate = date.toISOString().split('T')[0];
      this.reservationForm.patchValue({"message":this.updateReservation.message});
      this.reservationForm.patchValue({"pickup_date":formattedDate})
    }

    const savedData = localStorage.getItem(this.SAVED_DATA);
    if (savedData) {
      const formData = JSON.parse(savedData);
      this.reservationForm.setValue({
        ...formData,
      });
    }
  }

  onSubmit() {
    localStorage.setItem(
      this.SAVED_DATA,
      JSON.stringify(this.reservationForm.value)
    );
    const today = new Date(); 
    const pickup = new Date(this.reservationForm.value.pickup_date);

    const maxUseWeeks = this.product?.maxUseTime ?? null;    
    
    if (pickup.getTime() >= today.getTime()) {
      console.log("Valid date");
      this.reservationForm.controls['pickup_date'].setErrors(null);
    } else {
      console.log("Invalid date");
      this.reservationForm.controls['pickup_date'].setErrors({ 'incorrect': true });
    }
    
    if (this.reservationForm.valid && this.product?.id && !this.updateReservation) {
      console.log("Valid Form")
      const formData = new FormData();
      formData.append('product', this.product?.id);
      formData.append('message', this.reservationForm.value.message);
      formData.append('pickup_date', pickup.toISOString());
      if(maxUseWeeks){
        let end_date = new Date(pickup);
        end_date.setDate(end_date.getDate() + (maxUseWeeks * 7))
        formData.append('end_date',end_date.toISOString());
      }
      this.reservationService.create(formData).subscribe({
        next: () => {
          localStorage.removeItem(this.SAVED_DATA);
          this.closePopup();
        },
        error: (err) => console.error(err)
      });
    }else if(this.updateReservation){
      this.updateReservation.message = this.reservationForm.value.message;
      this.updateReservation.pickup_date = this.reservationForm.value.pickup_date;
      if(maxUseWeeks){
        let end_date = new Date(pickup);
        end_date.setDate(end_date.getDate() + (maxUseWeeks * 7))
        this.updateReservation.end_date = end_date;
      }
      this.reservationService.update(this.updateReservation).subscribe({
        next: () => {
          localStorage.removeItem(this.SAVED_DATA);
          this.closePopup();
        },
        error: (err) => console.error(err)
      });
    }
    else{
      console.log("Invalid form");
    }
  }


  public closePopup(){
    this.closePop.emit();
  }
}
