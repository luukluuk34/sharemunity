import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ICommunity, IUser } from '@sharemunity-workspace/shared/api';
import { CommunityService } from '../community.service';
import { Subscription } from 'rxjs';
import { environment } from '@sharemunity/shared/util-env';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'sharemunity-community-list',
  templateUrl: './community-list.component.html',
  styleUrl: './community-list.component.css',
})
export class CommunityListComponent implements OnInit, OnDestroy {
  @Input() filterType: 'owned' | 'joined' | 'notJoined' = 'notJoined';
  @Output() communityHasList = new EventEmitter<boolean>();


  communities: ICommunity[] | null = null;
  subscription: Subscription | undefined = undefined;
  protected loggedInUser: IUser | null = null;


  constructor(private communityService: CommunityService,private authService:AuthenticationService, private router:Router) {

  }

  ngOnInit(): void {
    this.loadCommunities();
    this.authService.user$.subscribe(user =>{
      this.loggedInUser = user
  });

  }


  loadCommunities(): void {
    this.subscription = this.communityService.list(this.filterType).subscribe((data) =>{
      console.log(data);
      this.communities = data;
      if(this.communities && this.communities?.length > 0){
        this.communityHasList.emit(true);
      }else{
        this.communityHasList.emit(false);
      }
      this.getImages();
    });
  }

  getImages(){
    if (this.communities) {
      for (let community of this.communities) {
        console.log('Owner;' + community);
        if (community.communityImage?.path && !(community.communityImage.path.includes(environment.dataApiUrl))) {
          community.communityImage.path =
            environment.dataApiUrl +
            '/' +
            community.communityImage.path.replace(/\\/g, '/');
        }
      }
    }
  }

  joinCommunity(community:ICommunity){
    if(community && this.loggedInUser && !this.loggedInInCommunity(community)){
      console.log("New member!") 
      community.members.push(this.loggedInUser)
      this.communityService.update(community).subscribe(()=>{
        this.loadCommunities();
      });
    }else{
      console.log("Not logged in")
    }
  }

  leaveCommunity(community:ICommunity){
    if(community && this.loggedInUser && this.loggedInInCommunity(community)){
      console.log('Sad to see you go');
      let communityMembers = community.members.filter(user => user._id != this.loggedInUser?._id);
      console.log("Oter members are: ", communityMembers);
      community.members = communityMembers;
      this.communityService.update(community).subscribe(()=>{
        this.loadCommunities();
      });
    }
  }

  deleteCommunity(community:ICommunity){
    if(this.loggedInUser && this.loggedInUser._id == community.owner._id)
    this.communityService.delete(community.id).subscribe(()=>{
      this.loadCommunities();
    });
  }


  loggedInInCommunity(community:ICommunity):boolean{
    let returnBool = false;
    community.members.forEach((member)=> {
      if(this.loggedInUser && member._id == this.loggedInUser?._id){
        returnBool = true;
      }
    })
    return returnBool;
  }

  itemloggedInInCommunity(community:ICommunity):boolean{
    let returnBool = false;
    community.products.forEach((item)=>{
      if(this.loggedInUser && item.owner._id == this.loggedInUser._id){
      }
    })

    return returnBool;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
