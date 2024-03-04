import { ProductService} from './product/product.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { NgModule } from '@angular/core';


@NgModule({
    imports: [CommonModule,HttpClientModule,ProductDetailComponent],
    declarations: [ProductListComponent],
    providers: [ProductService],
    exports:[ProductListComponent,ProductDetailComponent]
  })
  export class FeaturesModule {}