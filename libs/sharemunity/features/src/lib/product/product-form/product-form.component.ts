import { Component, OnInit } from '@angular/core';
import { CommonModule,Location } from '@angular/common';
import { AuthenticationService } from '../../user/authentication.service';
import { IImage, IUser } from '@sharemunity-workspace/shared/api';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { uploadImageFileValidator } from '@sharemunity-workspace/sharemunity/common';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sharemunity-workspace-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  private readonly SAVED_PRODUCT_DATA = 'savedproductData';

  private authService: AuthenticationService;
  private prodService: ProductService;

  protected user: IUser | null = null;
  protected productForm!: FormGroup;

  invalidFiles: File[] = [];
  selectedImages: File[] = [];
  selectedPaths: string[] = [];

  constructor(
    authenticationService: AuthenticationService,
    productService: ProductService,
    private router:Router,
    private _location:Location
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

  async loadProductData() {
    const savedProductData = localStorage.getItem(this.SAVED_PRODUCT_DATA);
    if (savedProductData) {
      const formData = JSON.parse(savedProductData);
      console.log(formData.imageList);
      this.productForm.setValue({
        ...formData.prodForm,
      });
      this.selectedImages = await Promise.all(
        formData.imageList.map(
          (fileObj: { filename: string; base64: string }) =>
            this.base64ToFile(fileObj.base64, fileObj.filename)
        )
      );
      this.selectedPaths = formData.selectedPaths;
    }
  }

  async onSubmit() {
    const base64Images = await this.convertFilesToBase64(this.selectedImages);
    localStorage.setItem(
      this.SAVED_PRODUCT_DATA,
      JSON.stringify({
        prodForm: this.productForm.value,
        imageList: base64Images,
        selectedPaths: this.selectedPaths,
      })
    );

    if (
      this.productForm.valid &&
      this.selectedImages != null &&
      this.selectedImages.length > 0
    ) {
      const formData = new FormData();
      formData.append('name', this.productForm.value.name);
      formData.append('description', this.productForm.value.description);
      formData.append('maxUseTime', this.productForm.value.maxUseTime);
      this.selectedImages.forEach((file, index) => {
        formData.append(`images`, file, file.name);
      });
      this.prodService.create(formData).subscribe();
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

  deleteFromList(index: number) {
    this.selectedImages.splice(index, 1);
    this.selectedPaths.splice(index, 1);
    console.log(this.selectedImages);
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
