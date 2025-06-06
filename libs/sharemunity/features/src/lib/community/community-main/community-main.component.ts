import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router, RouterModule } from '@angular/router'
import { FeaturesModule } from "../../features.module";
import { ICommunity } from '@sharemunity-workspace/shared/api';
import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'sharemunity-workspace-community-main',
  templateUrl: './community-main.component.html',
  styleUrl: './community-main.component.css',
})
export class CommunityMainComponent implements OnInit{
  

  protected myCommunityEmpty:boolean = false;
  protected myJoinedCommuntiesEmpty:boolean = false;
  protected myProducts:boolean = false;
  refreshNotJoined = false;

  constructor(private router:Router, private auth:AuthenticationService){
  }
  
  
  
  ngOnInit(): void {  
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['/dashboard'])
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
  
  onCommunityChange(communityid:string){
    this.refreshNotJoined = !this.refreshNotJoined;
  }
}
