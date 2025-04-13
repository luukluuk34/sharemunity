import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sharemunity-workspace-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrl: './dashboard-wrapper.component.css',
})
export class DashboardWrapperComponent implements OnInit{


  constructor(private auth:AuthenticationService, private router:Router){}

  ngOnInit(): void {
    if(this.auth.isLoggedIn()){
      console.log("Loggedin")
      this.router.navigate(['/dashboard/loggedin'])
    }else{
      console.log("Not logged in")
      this.router.navigate(['/dashboard/guest'])
    }
  }


}
