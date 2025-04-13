import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sharemunity-workspace-dashboard-guest',
  templateUrl: './dashboard-guest.component.html',
  styleUrl: './dashboard-guest.component.css',
})
export class DashboardGuestComponent implements OnInit {
  
  constructor(private auth:AuthenticationService, private router:Router){

  }
  
  ngOnInit():void {
    let bool = this.auth.isLoggedIn();
    console.log("Isit???", bool)
    if(bool){
      console.log("Navigating towards: --------")
      this.router.navigate(['/dashboard/loggedin']);
    }else{
      console.log("Not navigating")
    }
  }


}
