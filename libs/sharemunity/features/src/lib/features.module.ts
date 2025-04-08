import { ProductService} from './product/product.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { NgModule } from '@angular/core';
import { CommunityListComponent } from './community/community-list/community-list.component';
import { CommunityService } from './community/community.service';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { UserService } from './user/user.service';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { CommunityMainComponent } from './community/community-main/community-main.component';
import { CommunityFormComponent } from './community/community-form/community-form.component';
import { RouterModule } from '@angular/router';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { CommunityDetailComponent } from './community/community-detail/community-detail.component';
import { CommunityChooseListComponent } from './community/community-choose-list/community-choose-list.component';
import { ReservationFormComponent } from './reservation/reservation-form/reservation-form.component';
import { ReservationService } from './reservation/reservation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ReservationPendingListComponent } from './reservation/reservation-pending-list/reservation-pending-list.component';
import { MyReservationListComponent } from './reservation/my-reservation-list/my-reservation-list.component';


@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule
    ],
    declarations: [
      CommunityListComponent,
      ProductDetailComponent,
      CommunityChooseListComponent,
      CommunityDetailComponent,
      ProductFormComponent,
      ReservationFormComponent,
      ReservationPendingListComponent,
      MyReservationListComponent,
      UserDetailComponent,
      CommunityFormComponent,
      CommunityMainComponent,
      ProductListComponent,
    ],
    providers: [ProductService,CommunityService,AuthenticationService,UserService,ReservationService],
    exports:[ProductListComponent,CommunityListComponent]
  })
  export class FeaturesModule {}