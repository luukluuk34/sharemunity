import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser, IUserIdentity } from '@sharemunity-workspace/shared/api';
import { UserService } from 'libs/sharemunity/features/src/lib/user/user.service';

@Component({
  selector: 'sharemunity-workspace-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private userService:UserService;
  protected user!:IUser;


  constructor(userService:UserService){
    this.userService = userService;
  }
  ngOnInit(): void {
    console.log(localStorage)
    let currentUser = localStorage.getItem('currentuser');
    if(currentUser != null){
      console.log("Current token")
      const _id = JSON.parse(currentUser)._id;
      this.userService.read(_id).subscribe((returnUser) => {
        console.log(returnUser);
        this.user = returnUser;
      });
    }
  }


}
