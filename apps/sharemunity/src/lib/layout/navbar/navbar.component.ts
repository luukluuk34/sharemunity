import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from 'libs/sharemunity/features/src/lib/user/user.service';
import { User } from '@sharemunity-workspace/user';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { IUser } from '@sharemunity-workspace/shared/api';
@Component({
  selector: 'sharemunity-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit{

  isNavbarCollapsed = true;
  private authService:AuthenticationService;
  user!:IUser | null;
  

  constructor(authService:AuthenticationService){
    this.authService = authService;
  }

  ngOnInit(): void {
    this.user = this.authService.getUser()
    console.log("Navbar component: ")
    console.log(this.user);
  } 

  protected logout(): void {
    console.log("Logging out")
    this.authService.logout();
  }

}
