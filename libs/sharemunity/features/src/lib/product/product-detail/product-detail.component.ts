import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import {
  IProduct,
  IReservation,
  IUser,
} from '@sharemunity-workspace/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FeaturesModule } from '../../features.module';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { ReservationService } from '../../reservation/reservation.service';
import { environment } from '@sharemunity/shared/util-env';
import { DataTransferService } from 'libs/sharemunity/common/src/lib/datatransfer/datatransfer.service';
import { tap } from 'rxjs';

@Component({
  selector: 'sharemunity-workspace-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  private productService: ProductService;
  protected authService: AuthenticationService;
  protected resService: ReservationService;

  protected product: IProduct | null = null;
  protected reservation: IReservation | null = null;
  protected addProductToCommunity: boolean = false;
  createReservationForProduct: boolean = false;
  selectedImage: string | null = null;

  protected loggedInUser: IUser | null = null;

  constructor(
    productService: ProductService,
    authService: AuthenticationService,
    resService: ReservationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataTransferService:DataTransferService,
    private cdr:ChangeDetectorRef
  ) {
    this.productService = productService;
    this.authService = authService;
    this.resService = resService;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.loggedInUser = user;
    });
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      this.productService.read(id).subscribe((product) => {
        this.product = product;
        console.log(this.product);
        this.getLocalProductImages();
        if (this.product == null) {
          this.router.navigate(['/dashboard']);
        }
        this.resService
          .getProductReservation(this.product?.id)
          .subscribe((res) => {
            this.reservation = res;
          });
      });
    });
  }

  getImageUrl(localPath: string): string {
    let path = (localPath = environment.dataApiUrl + '/' + localPath.replace(/\\/g, '/'));
    return path;
  }

  reservationDeleted(){
    this.reservation = null;
  }

  getLocalProductImages() {
    if (this.product) {
      this.product.images.forEach((img) => {
        if(!img.path.includes(environment.dataApiUrl)){
          img.path = this.getImageUrl(img.path);
        }
      });
    }
  }
  onImageError(event:Event){
    const target = event.target as HTMLImageElement;
    target.src = 'assets/default-image.jpg';
  }
  selectImage(path: string): void {
    this.selectedImage = path;
  }

  checkIfUserIsOwner(): boolean {
    return this.loggedInUser?._id == this.product?.owner._id;
  }

  deleteProduct() {
    if (this.product) {
      this.productService.delete(this.product?.id).subscribe();
      this.router.navigate(['/dashboard']);
    }
  }

  openPopupAddToCommunity() {
    this.addProductToCommunity = true;
  }
  openPopupCreateReservation() {
    this.createReservationForProduct = true;
  }
  

  closePopup() {
    this.addProductToCommunity = false;
    this.createReservationForProduct = false;
    if (this.product?.id) {
      this.reservation = null;
      console.log("In the IF")
      this.resService
        .getProductReservation(this.product.id)
        .pipe(
          tap((res)=> console.log(`Fetched resevation:`, res))
        )
        .subscribe((res) => {
          this.reservation ={...res};
          this.cdr.detectChanges();
        });
        
    }
  }

  route(){
    this.dataTransferService.setData(this.product);
    this.router.navigate(['/product/form/update']);
  }

}
