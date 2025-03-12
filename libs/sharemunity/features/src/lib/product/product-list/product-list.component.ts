import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { IProduct } from '@sharemunity-workspace/shared/api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sharemunity-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
    products: IProduct[] | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        console.log("test-----------------")
        this.subscription = this.productService.list().subscribe((results) => {
            console.log(`results: ${results}`);
            this.products = results;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
