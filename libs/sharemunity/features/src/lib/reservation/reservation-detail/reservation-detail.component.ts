import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../reservation.service';
import { Reservation } from 'libs/backend/features/src/lib/reservation/reservation.schema';
import { take } from 'rxjs';

@Component({
  selector: 'sharemunity-workspace-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.css',
})
export class ReservationDetailComponent implements OnInit {
  @Input({required:false}) reservationId!:string;
  
  private resService:ReservationService;
  reservation:Reservation | null = null;


  constructor(reservationService:ReservationService){
    this.resService = reservationService;
  }
  
  ngOnInit(): void {
    if(this.reservationId){
      this.resService.read(this.reservationId).pipe(take(1)).subscribe((res)=>{
        if(res){
          this.reservation = res;
        }
      })
    }
  }
}
