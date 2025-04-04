import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { IProduct, IUser } from '@sharemunity-workspace/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FeaturesModule } from "../../features.module";
import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'sharemunity-workspace-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit{
  private productService:ProductService;
  protected product:IProduct | null = null;
  protected addProductToCommunity:boolean = false;
  createReservationForProduct:boolean = false;

  protected loggedInUser: IUser | null = null;
  protected authService:AuthenticationService;

  constructor(productService:ProductService,authService:AuthenticationService, private activatedRoute:ActivatedRoute,private router:Router){
    this.productService = productService;
    this.authService = authService;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user =>{this.loggedInUser = user})

    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      this.productService.read(id).subscribe((product) => {
        this.product = product;
      })
    });
  }

  checkIfUserIsOwner():boolean{
    return this.loggedInUser?._id == this.product?.owner;
  }

  deleteProduct(){
    if(this.product){
      this.productService.delete(this.product?.id).subscribe();
      this.router.navigate(["/dashboard"]);
    }
    
  }
 
  openPopupAddToCommunity(){
    this.addProductToCommunity = true;
  }
  openPopupCreateReservation(){
    this.createReservationForProduct = true;
  }

  closePopup(){
    this.addProductToCommunity = false;
    this.createReservationForProduct = false;
  }
}
