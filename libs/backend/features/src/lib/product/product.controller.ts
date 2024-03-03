import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProduct } from '@sharemunity-workspace/shared/api';
import {CreateProductDto} from '@sharemunity-workspace/backend/dto'

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('')
    getAll(): IProduct[] {
        return this.productService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): IProduct {
        return this.productService.getOne(id);
    }

    @Post('')
    create(@Body() data: CreateProductDto): IProduct {
        return this.productService.create(data);
    }

}
