import { Component, OnInit } from '@angular/core';
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

  protected loggedInUser: IUser | null = null;

  constructor(
    productService: ProductService,
    authService: AuthenticationService,
    resService: ReservationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
    return (localPath =
      'http://' + environment.dataApiUrl + '/' + localPath.replace(/\\/g, '/'));
  }

  reservationDeleted(){
    this.reservation = null;
  }

  getLocalProductImages() {
    if (this.product) {
      this.product.images.forEach((img) => {
        img.path = this.getImageUrl(img.path);
      });
    }
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
      this.resService
        .getProductReservation(this.product.id)
        .subscribe((res) => {
          this.reservation = res;
          console.log('Updated reservation:', this.reservation);
        });
    }
  }
}
