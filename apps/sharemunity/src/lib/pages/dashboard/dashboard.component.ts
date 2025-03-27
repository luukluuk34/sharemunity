import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser, IUserIdentity } from '@sharemunity-workspace/shared/api';
import { UserService } from 'libs/sharemunity/features/src/lib/user/user.service';
import { LoginComponent } from "../../authentication/login/login.component";
import { FeaturesModule } from "../../../../../../libs/sharemunity/features/src/lib/features.module";
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';

@Component({
  selector: 'sharemunity-workspace-dashboard',
  standalone: true,
  imports: [CommonModule, LoginComponent, FeaturesModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private userService:UserService;
  protected user:IUser | null = null;
  protected authService:AuthenticationService;

  constructor(userService:UserService,private router:Router, authenticationService:AuthenticationService){
    this.userService = userService;
    this.authService = authenticationService;
  }
  ngOnInit(): void {
    console.log(localStorage)
    this.authService.user$.subscribe(user =>{this.user = user})
    if(this.user != null){
      this.userService.read(this.user._id).subscribe((returnUser) => {
        console.log(returnUser);
        this.user = returnUser;
      });
    }else{
      this.router.navigate(['/login'])
    }
  }


}
