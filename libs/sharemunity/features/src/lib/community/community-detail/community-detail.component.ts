import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICommunity, IProduct, IUser } from '@sharemunity-workspace/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../community.service';
import { environment } from '@sharemunity/shared/util-env';
import { ProductService } from '../../product/product.service';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { DataTransferService } from 'libs/sharemunity/common/src/lib/datatransfer/datatransfer.service';

@Component({
  selector: 'sharemunity-workspace-community-detail',
  templateUrl: './community-detail.component.html',
  styleUrl: './community-detail.component.css',
})
export class CommunityDetailComponent implements OnInit {
  protected community!: ICommunity;
  protected communityProducts:IProduct[] | null = null;
  private communityService: CommunityService;
  private productService:ProductService;
  private authService:AuthenticationService;

  protected loggedInUser:IUser | null = null;

  constructor(communityService: CommunityService,prodService:ProductService,authService:AuthenticationService,private activatedRoute: ActivatedRoute, private router:Router,private dataTransfer:DataTransferService) {
    this.communityService = communityService;
    this.authService = authService;
    this.productService = prodService;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user)=>{
      this.loggedInUser = user;
    })

    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      this.communityService.read(id).subscribe({
        next: (community) => {
          this.community = community;
          if(this.community == null){
            this.router.navigate(['/communities'])
          }
          this.getCommnityBannerImage();
          this.getLocalProductImages();
        },
        error: (err) => {
          console.error(`Error updating reservation`, err)
          this.router.navigate(['/communities'])
        }
      });
    });
  }

  getCommnityBannerImage() {
    if (this.community) {
      console.log('Owner;' + this.community.owner._id);
      if (!environment.production && this.community.communityImage?.path && !(this.community.communityImage.path.includes(environment.dataApiUrl))) {
        this.community.communityImage.path =  this.getImageUrl(this.community.communityImage.path);
      }
    }
  }

  getImageUrl(localPath:string):string{
    return localPath = environment.dataApiUrl + "/" + localPath.replace(/\\/g, '/');
  }

  getLocalProductImages(){
    if(!environment.production){
      if(this.community){
        this.community.products.forEach(prod=>{
          prod.images.forEach((img)=>{
            img.path = this.getImageUrl(img.path);
          })
        })
      }
    }
  }

  checkIfUserIsOwner(){
    return this.loggedInUser?._id == this.community.owner._id;
  }

  deleteCommunity(){
    if(this.community){
      this.communityService.delete(this.community.id).subscribe();
      this.router.navigate(["/dashboard"]);
    }
  }

  route(){
    this.dataTransfer.setData(this.community);
    this.router.navigate(['/communities/form/update']);
  }
}
