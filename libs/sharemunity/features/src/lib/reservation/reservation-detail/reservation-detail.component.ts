import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'sharemunity-workspace-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.css',
})
export class ReservationDetailComponent implements OnInit {
  
  private resService:ReservationService;

  constructor(reservationService:ReservationService){
    this.resService = reservationService;
  }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
