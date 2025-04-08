import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { UserService } from '../user.service';
import { IUser } from '@sharemunity-workspace/shared/api';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  selector: 'sharemunity-workspace-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  private authService:AuthenticationService;
  private userService:UserService;
  private loggedIn:IUser | null = null;
  protected userPage:IUser | null = null;


  constructor(authService:AuthenticationService,userService:UserService, private route:ActivatedRoute){
    this.authService = authService;
    this.userService = userService;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((sub)=>{
      this.loggedIn = sub;
    })
    console.log(this.loggedIn);
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      this.userService.read(id).subscribe((user)=>{
        this.userPage = user;
      })
    })

  }

  checkIfUserIsOwner(id?:string):Boolean{
    if(this.loggedIn?._id == this.userPage?._id || this.loggedIn?._id == id){
      return true;
    }
    return false;
  }

}
