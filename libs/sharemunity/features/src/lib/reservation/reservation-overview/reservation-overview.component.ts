import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../user/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sharemunity-workspace-reservation-overview',
  templateUrl: './reservation-overview.component.html',
  styleUrl: './reservation-overview.component.css',
})
export class ReservationOverviewComponent implements OnInit{
  
  constructor(private router:Router,private auth:AuthenticationService){

  }
  
  ngOnInit(): void {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
  }


}
