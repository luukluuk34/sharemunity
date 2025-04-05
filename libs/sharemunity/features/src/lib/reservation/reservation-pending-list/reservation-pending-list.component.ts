import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../reservation.service';
import { IReservaton, ReservationStatus } from '@sharemunity-workspace/shared/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sharemunity-workspace-pending-reservation-list',
  templateUrl: './reservation-pending-list.component.html',
  styleUrl: './reservation-pending-list.component.css',
})
export class ReservationPendingListComponent implements OnInit {
  private reservationService:ReservationService;
  pendingReservations:IReservaton[] | null = null;

  reservationForms:{[key:string]:FormGroup} = {};

  constructor(resService:ReservationService,private fb:FormBuilder){
    this.reservationService= resService;
  }

  ngOnInit(): void {
    this.loadPendingReservations();
  }

  onSubmit(reservation:IReservaton){
    const form = this.reservationForms[reservation.id];
    if(form.valid){
      console.log(reservation);
      const updatedStatus = form.value.reservation_status;
      const newRes:IReservaton= {
        ...reservation,
        reservation_status:updatedStatus
      }
      this.reservationService.update(newRes).subscribe({
        next: () =>{
          this.loadPendingReservations();
        },
        error: (err) =>{
          console.error(`Error updating reservation:`, err);
        }
      });
    }
  }

  loadPendingReservations(){
    this.reservationService.listPending().subscribe((reservation =>{
      this.pendingReservations = reservation;
      if(this.pendingReservations){
        this.pendingReservations.forEach(res => {
          this.reservationForms[res.id] = this.fb.group({
            reservation_status: [res.reservation_status || '', Validators.required]
          });
        });
      }
    }))
  }

  public get reservationStatus():typeof ReservationStatus{
    return ReservationStatus;
  }
}
