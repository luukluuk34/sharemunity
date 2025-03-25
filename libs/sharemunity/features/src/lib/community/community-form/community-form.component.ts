import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { AuthenticationService } from '../../user/authentication.service';
import { CommunityService } from '../community.service';
import { uploadImageFileValidator } from '@sharemunity-workspace/sharemunity/common';
import { ICreateImage } from '@sharemunity-workspace/shared/api';


@Component({
  selector: 'sharemunity-workspace-community-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './community-form.component.html',
  styleUrl: './community-form.component.css',
})
export class CommunityFormComponent implements OnInit{
  private readonly SAVED_DATA = "savedData";
  private selectedFile: File | null = null;

  communityForm!:FormGroup;
  authenticationService:AuthenticationService;
  commService:CommunityService;

  constructor(authService:AuthenticationService,communityService:CommunityService){
    this.authenticationService = authService;
    this.commService = communityService;
  }
  ngOnInit(): void {
    this.communityForm = new FormGroup({
      name: new FormControl(null,[
        Validators.required,
      ]),
      description: new FormControl(null,[
        Validators.required,
      ]),
      bannerData: new FormControl(null,[
        Validators.required,
        uploadImageFileValidator()
      ])
    })
    const savedData = localStorage.getItem(this.SAVED_DATA);
    if(savedData){
      const formData =JSON.parse(savedData)
      this.communityForm.setValue({
        ...formData,
        bannerData:null
      });
    }
  }



  onSubmit(): void {
    localStorage.setItem(this.SAVED_DATA,JSON.stringify(this.communityForm.value));
    if(this.communityForm.valid && this.selectedFile){
      const formData = new FormData();
      formData.append('name',this.communityForm.value.name);
      formData.append('description',this.communityForm.value.description);
      formData.append('images',this.selectedFile,this.selectedFile.name);
      this.commService.create(formData).subscribe(community => {console.log(community)});
      this.resetFileInput();
    }

  }

  onFileSelected(event:Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0){
      this.selectedFile = input.files[0];

      const fileData:ICreateImage = {
        filename: this.selectedFile.name,
        encoding: 'UTF-8',
        mimetype: this.selectedFile.type,
        path: '',
        size:this.selectedFile.size
      };
      console.log(fileData);
      this.communityForm.patchValue({bannerData:fileData});

    }
  }

  resetFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if(fileInput){
      fileInput.value = '';
    }
    this.selectedFile = null;
  }
}
