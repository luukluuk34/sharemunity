import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AuthenticationService } from '../../user/authentication.service';
import { ProductService } from '../product.service';
import { IImage, IProduct, IUser } from '@sharemunity-workspace/shared/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTransferService } from 'libs/sharemunity/common/src/lib/datatransfer/datatransfer.service';

@Component({
  selector: 'sharemunity-workspace-product-update-form',
  templateUrl: './product-update-form.component.html',
  styleUrl: './product-update-form.component.css',
})
export class ProductUpdateFormComponent implements OnInit {
  private readonly SAVED_PRODUCT_DATA = 'savedproductData';

  private authService: AuthenticationService;
  private prodService: ProductService;

  protected user: IUser | null = null;
  protected productForm!: FormGroup;
  protected product:IProduct | null = null;


  productImages: IImage[] = [];

  invalidFiles: File[] = [];
  selectedImages: File[] = [];
  selectedPaths: string[] = [];

  constructor(
    authenticationService: AuthenticationService,
    productService: ProductService,
    private router:Router,
    private _location:Location,
    private dataTransferService:DataTransferService
  ) {
    this.authService = authenticationService;
    this.prodService = productService;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.productForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      maxUseTime: new FormControl(null),
    });
    this.loadProductData();
  }

  loadProductData() {
    const product:IProduct = this.dataTransferService.getData();
    console.log(product);
    if(product){
      this.product = product;
      this.productForm.setValue({
        name: product.name,
        description: product.description,
        maxUseTime: product.maxUseTime 
      });
      this.productImages = product.images;
    }
  }

  onSubmit() {
    if (
      this.product &&
      this.productForm.valid &&
      this.selectedImages != null &&
      this.selectedImages.length > 0
    ) {

      let maxTime = this.productForm.value.maxUseTime ? this.productForm.value.maxUseTime : 0
      const formData = new FormData();
      formData.append('name', this.productForm.value.name);
      formData.append('description', this.productForm.value.description);
      formData.append('maxUseTime', maxTime);
      this.selectedImages.forEach((file, index) => {
        formData.append(`images`, file, file.name);
      });

      formData.append(`keptImages`,JSON.stringify(this.productImages));

      this.prodService.update(this.product.id,formData).subscribe();
      localStorage.removeItem(this.SAVED_PRODUCT_DATA);
      this._location.back();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.invalidFiles = [];
      let fileList: File[] = Array.from(input.files);
      fileList.forEach((elm) => {
        if (!this.validateIfImageFile(elm)) {
          this.invalidFiles.push(elm);
        } else {
          this.selectedPaths.push(URL.createObjectURL(elm));
        }
      });
      fileList = fileList.filter((elm) => this.validateIfImageFile(elm));
      this.selectedImages = [...this.selectedImages, ...fileList];
    }
    input.value = '';
  }

  deleteFromList(index: number,selectImage:boolean) {
    if(selectImage){
      this.selectedImages.splice(index, 1);
      this.selectedPaths.splice(index, 1);
      console.log(this.selectedImages);
    }else{
      this.productImages.splice(index,1);
      console.log(this.productImages);
    }

  }

  convertFileToIImage(file: File): IImage {
    return {
      filename: file.name,
      encoding: 'binary',
      mimetype: file.type,
      path: URL.createObjectURL(file),
      size: file.size,
    };
  }

  convertFilesToBase64(
    files: File[]
  ): Promise<{ filename: string; base64: string }[]> {
    return Promise.all(
      files.map((file) => {
        return new Promise<{ filename: string; base64: string }>(
          (resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () =>
              resolve({ filename: file.name, base64: reader.result as string });
            reader.onerror = reject;
          }
        );
      })
    );
  }

  async base64ToFile(base64: string, filename: string): Promise<File> {
    const response = await fetch(base64);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  getFilePath(file: File): string {
    console.log(file);
    return URL.createObjectURL(file);
  }

  validateIfImageFile(file: File): Boolean {
    const validImageTypes = ['image/jpeg', 'image/png'];
    return validImageTypes.includes(file.type);
  }

}
