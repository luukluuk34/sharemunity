import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../reservation.service';
import { Reservation } from 'libs/backend/features/src/lib/reservation/reservation.schema';

import { Router } from '@angular/router';
import { IUser, ReservationStatus } from '@sharemunity-workspace/shared/api';
import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'sharemunity-workspace-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.css',
})
export class ReservationDetailComponent implements OnInit {
  @Input({ required: false }) reservationId!: string;
  @Output() reservationDeleted = new EventEmitter<void>();

  private resService: ReservationService;
  protected loggedInUser: IUser | null = null;
  reservation: Reservation | null = null;

  constructor(reservationService: ReservationService,private authService:AuthenticationService, private router: Router) {
    this.resService = reservationService;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user)=>{
      this.loggedInUser = user;
    })


    if (this.reservationId) {
      this.resService.read(this.reservationId).subscribe((res) => {
        if (res) {
          this.reservation = {
            ...res,
            pickup_date: new Date(res.pickup_date),
          };
          if (res.end_date) {
            this.reservation = {
              ...this.reservation,
              end_date: new Date(res.end_date),
            };
          }
        }
      });
    }
  }

  deleteReservation() {
    if (this.reservation) {
      this.resService.delete(this.reservation.id).subscribe((res) => {
        this.reservationDeleted.emit();
      });
    }
  }
  public get reservationStatus(): typeof ReservationStatus {
    return ReservationStatus;
  }
}
