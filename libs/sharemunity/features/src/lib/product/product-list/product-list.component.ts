import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { IProduct, IUser } from '@sharemunity-workspace/shared/api';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../user/authentication.service';
import { environment } from '@sharemunity/shared/util-env';

@Component({
    selector: 'sharemunity-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
    @Input({required:false}) communityId!:string;
    @Input({required:false}) personalProductsId!:string;
    @Output() productHasList = new EventEmitter<boolean>();

    products: IProduct[] | null = null;
    subscription: Subscription | undefined = undefined;

    private authService:AuthenticationService;
    protected loggedInUser: IUser | null = null;

    constructor(private productService: ProductService, private router:Router, authService:AuthenticationService) {
        this.authService = authService;
    }

    ngOnInit(): void {
        this.authService.user$.subscribe(user =>{
            this.loggedInUser = user
        });

        if(this.personalProductsId){
            this.subscription = this.productService.listByUser(this.personalProductsId).subscribe((results) => {
                console.log("-----------------------")
                
                this.products = results;
                this.checkIfProducts();
                this.getLocalProductImages();
            });
        } else if(this.communityId){
            this.subscription = this.productService.listByCommunity(this.communityId).subscribe((results) => {
                this.products = results;
                this.checkIfProducts();
                this.getLocalProductImages();
            });
        }
        else{
            this.subscription = this.productService.list().subscribe((results) => {
                this.products = results;
                this.checkIfProducts();
                this.getLocalProductImages();
            });
        }
    }

    checkIfProducts(){
        if(this.products && this.products.length > 0){
            this.productHasList.emit(true);
        }else{
            this.productHasList.emit(false);
        }
    }

      getImageUrl(localPath:string):string{
        return localPath = environment.dataApiUrl + "/" + localPath.replace(/\\/g, '/');
      }
    
      getLocalProductImages(){
        if(this.products){
          this.products.forEach(prod=>{
            prod.images.forEach((img)=>{
              img.path = this.getImageUrl(img.path);
            })
          })
        }
      }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
