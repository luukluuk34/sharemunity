import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { IProduct } from '@sharemunity-workspace/shared/api';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
    standalone:true,
    selector: 'sharemunity-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    imports:[CommonModule,RouterLink]
})
export class ProductListComponent implements OnInit, OnDestroy {
    @Input({required:false}) communityId!:string;

    products: IProduct[] | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private productService: ProductService, private router:Router) {}

    ngOnInit(): void {
        this.subscription = this.productService.list().subscribe((results) => {
            this.products = results;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
