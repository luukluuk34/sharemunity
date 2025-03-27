import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../user/authentication.service';
import { IImage, IUser } from '@sharemunity-workspace/shared/api';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { uploadImageFileValidator } from '@sharemunity-workspace/sharemunity/common';
import { ProductService } from '../product.service';

@Component({
  selector: 'sharemunity-workspace-product-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  private readonly SAVED_PRODUCT_DATA = "savedproductData";

  private authService:AuthenticationService;
  private prodService:ProductService;

  protected user:IUser | null = null;
  protected productForm!:FormGroup;

  invalidFiles: File[] = [];
  selectedImages: IImage[] = [];
  
  constructor(authenticationService:AuthenticationService, productService:ProductService){
    this.authService = authenticationService;
    this.prodService = productService;
  }
  
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.productForm = new FormGroup({
      name: new FormControl(null,[
        Validators.required,
      ]),
      description: new FormControl(null,[
        Validators.required
      ]),
      maxUseTime: new FormControl(null),
    })
    const savedProductData = localStorage.getItem(this.SAVED_PRODUCT_DATA);
    if(savedProductData){
      const formData = JSON.parse(savedProductData);
      
      this.productForm.setValue({
        ...formData.prodForm
      });
      this.selectedImages = formData.imageList;
    }
  }

  onSubmit(){
    localStorage.setItem(this.SAVED_PRODUCT_DATA, JSON.stringify(
      {
        prodForm:this.productForm.value,
        imageList:this.selectedImages
      }));

      if(this.productForm.valid && this.selectedImages != null && this.selectedImages.length > 0){
        console.log("Valid form");
        const formData = new FormData();
        formData.append('name',this.productForm.value.name);
        formData.append('description',this.productForm.value.description);
        formData.append('maxUseTime',this.productForm.value.maxUseTime);
        this.selectedImages.forEach((file,index)=>{
          formData.append(`images`, JSON.stringify(file))
        })
        //this.prodService.create();
      }

  }

  onFileSelected(event:Event){
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.invalidFiles = [];
      
      let fileList:File[] = Array.from(input.files);
      fileList.forEach(elm => {
        if (!this.validateIfImageFile(elm)) {
          this.invalidFiles.push(elm);
        }
      });
      
      fileList = fileList.filter(elm => this.validateIfImageFile(elm));
      this.selectedImages = [...this.selectedImages, ...fileList.map(file => this.convertFileToIImage(file))];
      console.log(this.selectedImages);
    }
    input.value = '';
  }

  deleteFromList(index:number){
    this.selectedImages.splice(index,1);
    console.log(this.selectedImages);
  }

  convertFileToIImage(file:File):IImage{
    return {
      filename:file.name,
      encoding:'binary',
      mimetype:file.type,
      path: URL.createObjectURL(file),
      size: file.size
    }
  }


  validateIfImageFile(file:File):Boolean{
    const validImageTypes = ['image/jpeg', 'image/png'];
    return validImageTypes.includes(file.type);
  }

}
