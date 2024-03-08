import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProduct } from '@sharemunity-workspace/shared/api';
import {CreateProductDto} from '@sharemunity-workspace/backend/dto'
import { AuthGuard } from '@sharemunity-workspace/backend/auth';
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('')
    getAll(): Promise<IProduct[]> {
        return this.productService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IProduct | null> {
        return this.productService.findOne(id);
    }

    @Post('')
    @UseGuards(AuthGuard)
    create(@Body() data: CreateProductDto): Promise<IProduct | null> {
        return this.productService.create(data);
    }

}
