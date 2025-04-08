import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICommunity, IUser, IUserIdentity } from '@sharemunity-workspace/shared/api';
import { UserService } from 'libs/sharemunity/features/src/lib/user/user.service';
import { LoginComponent } from "../../authentication/login/login.component";
import { FeaturesModule } from "../../../../../../libs/sharemunity/features/src/lib/features.module";
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';

@Component({
  selector: 'sharemunity-workspace-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private userService:UserService;
  protected user:IUser | null = null;
  protected authService:AuthenticationService;

  protected myCommunityEmpty:boolean = false;
  protected myJoinedCommuntiesEmpty:boolean = false;
  protected myProducts:boolean = false;

  constructor(userService:UserService,private router:Router, authenticationService:AuthenticationService){
    this.userService = userService;
    this.authService = authenticationService;
  }
  ngOnInit(): void {
    this.authService.user$.subscribe(user =>{this.user = user})
    if(this.user != null){
      this.userService.read(this.user._id).subscribe((returnUser) => {
        console.log(returnUser);
        this.user = returnUser;
      });
    }else{
      console.log(this.user);
      this.router.navigate(['/login'])
    }
  }

  getMyCommunities(com:boolean){
    console.log(`Boolean: ${com}`)
    this.myCommunityEmpty = com;
  }
  getMyJoinedCommunities(com:boolean){
    console.log(`Boolean: ${com}`)
    this.myJoinedCommuntiesEmpty = com;
  }
  getMyProducts(prod:boolean){
    this.myProducts = prod;
  }


}
