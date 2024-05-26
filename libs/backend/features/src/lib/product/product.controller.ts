import { Body, Controller, Get, Param, Post, Request, UploadedFiles, UseGuards,Headers, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProduct } from '@sharemunity-workspace/shared/api';
import {CreateProductDto} from '@sharemunity-workspace/backend/dto'
import { AuthGuard } from '@sharemunity-workspace/backend/auth';
import { FilesInterceptor} from '@nestjs/platform-express';
import {Multer, diskStorage} from 'multer';
import {environment} from '@sharemunity/shared/util-env';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('product')
export class ProductController {
    
    constructor(private productService: ProductService,private firebaseRepository:FirebaseService) {}

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
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                console.log("using interceptor");
                const fieldname = `${Date.now()}-${file.originalname}`;
                cb(null, fieldname);
            },
        }),
    }))
    create(
        @Request() req:any,
        @Body() data: CreateProductDto,
        @UploadedFiles() images:Array<Express.Multer.File>
    ): Promise<IProduct | null> {
        console.log('FormData: ', req.body);
        console.log('Uploaded Files: ', images);
        console.log('Data: ', data);
        

        return this.productService.create(req);
    }

}
