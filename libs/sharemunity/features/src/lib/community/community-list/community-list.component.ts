import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICommunity } from '@sharemunity-workspace/shared/api';
import { CommunityService } from '../community.service';
import { Subscription } from 'rxjs';
import { environment } from '@sharemunity/shared/util-env';

@Component({
  selector: 'sharemunity-community-list',
  templateUrl: './community-list.component.html',
  styleUrl: './community-list.component.css',
})
export class CommunityListComponent implements OnInit, OnDestroy {
  communities: ICommunity[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private communityService: CommunityService) {
    console.log("BIg Fat test")
  }

  ngOnInit(): void {
    this.subscription = this.communityService.list().subscribe((results) => {
      this.communities = results;
      if (this.communities) {
        for (let community of this.communities) {
          if (community.communityImage?.path) {
            community.communityImage.path = "http://" + environment.dataApiUrl + "/" + community.communityImage.path.replace(/\\/g, '/');
          }
        }
      }
    });
  }
  

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
