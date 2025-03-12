import { ProductService} from './product/product.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { NgModule } from '@angular/core';
import { CommunityListComponent } from './community/community-list/community-list.component';
import { CommunityService } from './community/community.service';


@NgModule({
    imports: [CommonModule,HttpClientModule,ProductDetailComponent],
    declarations: [ProductListComponent,CommunityListComponent],
    providers: [ProductService,CommunityService],
    exports:[ProductListComponent,ProductDetailComponent,CommunityListComponent]
  })
  export class FeaturesModule {}