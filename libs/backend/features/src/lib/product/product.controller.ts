import { Body, Controller, Get, Param, Post, Request, UploadedFiles, UseGuards,Headers, UseInterceptors, Logger, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProduct } from '@sharemunity-workspace/shared/api';
import {CreateProductDto} from '@sharemunity-workspace/backend/dto'
import { AuthGuard } from '@sharemunity-workspace/backend/auth';
import { FilesInterceptor} from '@nestjs/platform-express';
import {Multer, diskStorage} from 'multer';
import {environment} from '@sharemunity/shared/util-env';
import { FirebaseService } from '../firebase/firebase.service';
import { LocalImageFileInterceptor } from '@sharemunity-workspace/backend/dto';

@Controller('product')
export class ProductController {
    private readonly logger: Logger = new Logger(ProductController.name);
    constructor(private productService: ProductService,private firebaseRepository:FirebaseService) {}

    @Get('')
    getAll(): Promise<IProduct[]> {
        return this.productService.findAll();
    }

    @Get('all/:id')
    getAllByCommunity(@Param('id') id:string):Promise<IProduct[]>{
        return this.productService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IProduct | null> {
        return this.productService.findOne(id);
    }

    @Post('')
    @UseGuards(AuthGuard)
    @LocalImageFileInterceptor()
    create(
        @Request() req:any,
        @Body() data: CreateProductDto,
        @UploadedFiles() images:Array<Express.Multer.File>
    ): Promise<IProduct | null> {
        images.forEach((file) => {
            if (!file.filename){
                const timestamp = Date.now();
                file.filename = `${timestamp}-${file.originalname}`;
            }
        });

        return this.productService.create(req);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    delete(@Param('id') id: string){
        this.logger.debug("-------deleting--------")
        return this.productService.delete(id);
    }

}
