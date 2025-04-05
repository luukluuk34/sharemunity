import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../reservation.service';
import { IReservaton } from '@sharemunity-workspace/shared/api';

@Component({
  selector: 'sharemunity-workspace-my-reservation-list',
  templateUrl: './my-reservation-list.component.html',
  styleUrl: './my-reservation-list.component.css',
})
export class MyReservationListComponent implements OnInit{
  private resService:ReservationService;

  myReservations:IReservaton[] | null = null;

  constructor(reservationService:ReservationService){
    this.resService = reservationService;
  }
  
  ngOnInit(): void {
    this.resService.myReservations().subscribe((res)=>{
      this.myReservations = res;
    })
  }

}
