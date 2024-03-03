import { Injectable, NotFoundException } from '@nestjs/common';
import {IProduct, ProductStatus} from '@sharemunity-workspace/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class ProductService {
    TAG = 'ProductService';

    private product$ = new BehaviorSubject<IProduct[]>([
        {
            id: '0',
            owner: 'productOwnerName',
            enjoyer: 'productEnjoyer',
            name: 'BookOne',
            description: 'this Book has 600 pages',
            maxUseTime: new Date(),
            status:ProductStatus.Available,
        },
    ]);

    getAll(): IProduct[] {
        Logger.log('getAll', this.TAG);
        return this.product$.value;
    }

    getOne(id: string): IProduct {
        Logger.log(`getOne(${id})`, this.TAG);
        const product = this.product$.value.find((td) => td.id === id);
        if (!product) {
            throw new NotFoundException(`Product could not be found!`);
        }
        return product;
    }

    /**
     * Update the arg signature to match the DTO, but keep the
     * return signature - we still want to respond with the complete
     * object
     */
    create(product: Pick<IProduct, 'owner'| 'enjoyer' | 'name' | 'description' | 'maxUseTime' | 'status'>): IProduct {
        Logger.log('create', this.TAG);
        const current = this.product$.value;
        // Use the incoming data, a randomized ID, and a default value of `false` to create the new to-do
        const newProduct: IProduct = {
            ...product,
            id: `Product-${Math.floor(Math.random() * 10000)}`,
            owner: 'productOwnerName',
            enjoyer: 'productEnjoyer',
            name: 'BookOne',
            description: 'this Book has 600 pages',
            maxUseTime: new Date(),
            status:ProductStatus.Available,
        };
        this.product$.next([...current, newProduct]);
        return newProduct;
    }
}
