import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICommunity } from '@sharemunity-workspace/shared/api';
import { CommunityService } from '../community.service';
import { Subscription } from 'rxjs';
import { environment } from '@sharemunity/shared/util-env';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../product/product.service';

@Component({
  selector: 'sharemunity-community-list',
  templateUrl: './community-list.component.html',
  styleUrl: './community-list.component.css',
})
export class CommunityListComponent implements OnInit, OnDestroy {
  @Input() filterType: 'owned' | 'joined' | 'notJoined' = 'joined';
  communities: ICommunity[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private communityService: CommunityService, private router:Router) {}

  ngOnInit(): void {
    this.loadCommunities();
  }


  loadCommunities(): void {
    if(this.filterType === 'owned'){
      this.subscription = this.communityService.list().subscribe((data) =>{
        this.communities = data;
        this.getImages();
      });
    }else if (this.filterType === 'joined'){
      this.subscription = this.communityService.list().subscribe((data) =>{
        this.communities = data;
        this.getImages();
      });
    }else{
      this.subscription = this.communityService.list().subscribe((data) =>{
        this.communities = data;
        this.getImages();
      });
    }

  }

  getImages(){
    if (this.communities) {
      for (let community of this.communities) {
        console.log('Owner;' + community);
        if (community.communityImage?.path) {
          community.communityImage.path =
            'http://' +
            environment.dataApiUrl +
            '/' +
            community.communityImage.path.replace(/\\/g, '/');
        }
      }
    }
  }

  getCommunities() {
    this.subscription = this.communityService.list().subscribe((results) => {
      this.communities = results;
      if (this.communities) {
        for (let community of this.communities) {
          console.log(community);
          if (community.communityImage?.path) {
            community.communityImage.path =
              'http://' +
              environment.dataApiUrl +
              '/' +
              community.communityImage.path.replace(/\\/g, '/');
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
