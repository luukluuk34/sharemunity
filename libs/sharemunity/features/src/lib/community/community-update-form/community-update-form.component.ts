import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../user/authentication.service';
import { CommunityService } from '../community.service';
import { Router } from '@angular/router';
import { uploadImageFileValidator } from '@sharemunity-workspace/sharemunity/common';
import { ICommunity, ICreateImage, IImage } from '@sharemunity-workspace/shared/api';
import { DataTransferService } from 'libs/sharemunity/common/src/lib/datatransfer/datatransfer.service';

@Component({
  selector: 'sharemunity-workspace-community-update-form',
  templateUrl: './community-update-form.component.html',
  styleUrl: './community-update-form.component.css',
})
export class CommunityUpdateFormComponent implements OnInit {
  private readonly SAVED_DATA = 'savedCommunityData';
  private selectedFile: File | null = null;
  selectedImage:IImage | null = null;
  private community:ICommunity | null = null;
  
  communityForm!: FormGroup;
  private authenticationService: AuthenticationService;
  private commService: CommunityService;

  constructor(
    authService: AuthenticationService,
    communityService: CommunityService,
    private router: Router,
    private dataTransferService:DataTransferService
  ) {
    this.authenticationService = authService;
    this.commService = communityService;
  }
  ngOnInit(): void {
    this.communityForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      bannerData: new FormControl(null, [
        uploadImageFileValidator(),
      ]),
    });
    const community:ICommunity = this.dataTransferService.getData();
    if(community){
      this.community = community;
      this.communityForm.setValue({
        name:community.name,
        description:community.description,
        bannerData: null
      });
      this.selectedImage = this.community.communityImage;

    }else{
      this.router.navigate(['/dashboard'])
    }
  }

  onSubmit(): void {
    localStorage.setItem(
      this.SAVED_DATA,
      JSON.stringify(this.communityForm.value)
    );

    if(this.communityForm.valid){
      if(this.selectedFile && this.community){
        const formData = new FormData();
        formData.append('name', this.communityForm.value.name);
        formData.append('description', this.communityForm.value.description);
        formData.append('images', this.selectedFile, this.selectedFile.name);
  
        this.commService.updateWithForm(this.community.id, formData).subscribe((com) => {
          console.log("Updated with new image:", com);
          //this.router.navigate([`/communities/${com.id}`]);
        });
      }
      else{
        if(this.selectedImage && this.community){
          const updatedCommunity:ICommunity = {
            ...this.community,
            name:this.communityForm.value.name,
            description:this.communityForm.value.description,
            communityImage: this.selectedImage
          }
          this.commService.update(updatedCommunity).subscribe((com)=>{
            console.log("Updated: ",com);
          })
        }
      }
    }

      // this.commService.create(formData).subscribe((community) => {
      //   console.log(community),
      //     this.router.navigate([`/communities/${community.id}`]);
      // });
      //this.resetFileInput();
    }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = null;
      this.selectedFile = input.files[0];

      const fileData: ICreateImage = {
        filename: this.selectedFile.name,
        encoding: 'UTF-8',
        mimetype: this.selectedFile.type,
        path: '',
        size: this.selectedFile.size,
      };
      console.log(fileData);
      this.communityForm.patchValue({ bannerData: fileData });
    }
  }

  resetFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.selectedFile = null;
    localStorage.removeItem(this.SAVED_DATA);
  }
}
