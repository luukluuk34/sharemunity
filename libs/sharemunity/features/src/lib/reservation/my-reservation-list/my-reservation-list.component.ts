import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../reservation.service';
import { IReservation, ReservationStatus } from '@sharemunity-workspace/shared/api';

@Component({
  selector: 'sharemunity-workspace-my-reservation-list',
  templateUrl: './my-reservation-list.component.html',
  styleUrl: './my-reservation-list.component.css',
})
export class MyReservationListComponent implements OnInit{
  private resService:ReservationService;

  myReservations:IReservation[] | null = null;

  constructor(reservationService:ReservationService){
    this.resService = reservationService;
  }
  
  ngOnInit(): void {
    this.loadReservations();
  }

  deleteReservation(id:string){
    console.log(`Deleting reservation ${id}`);
    this.resService.delete(id).subscribe({
      next: () =>{
        this.loadReservations();
      },
      error: (err) => console.log(err)
    });
  }

  private loadReservations(){
    this.resService.myReservations().subscribe((res)=>{
      this.myReservations = res;
    })
  }

  public get reservationStatus():typeof ReservationStatus{
    return ReservationStatus;
  }
}
