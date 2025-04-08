import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { IUser } from '@sharemunity-workspace/shared/api';
@Component({
  selector: 'sharemunity-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit{
  private authService:AuthenticationService;
  user:IUser | null = null;

  constructor(authService:AuthenticationService,private router:Router){
    this.authService = authService;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) =>{
      this.user = user;
    })

  } 

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
