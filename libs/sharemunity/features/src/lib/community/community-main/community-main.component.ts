import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router, RouterModule } from '@angular/router'

@Component({
  selector: 'sharemunity-workspace-community-main',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './community-main.component.html',
  styleUrl: './community-main.component.css',
})
export class CommunityMainComponent implements OnInit{
  
  constructor(private router:Router){
    
  }
  
  
  
  ngOnInit(): void {
   
  }
}
