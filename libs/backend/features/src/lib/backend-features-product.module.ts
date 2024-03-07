import { Module } from "@nestjs/common";
import { ProductController } from "./product/product.controller";
import { ProductService } from "./product/product.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User as UserModel, UserSchema } from '@sharemunity-workspace/user';
import { Product as ProductModel, ProductSchema } from './product/product.schema';
import { AuthModule } from '@sharemunity-workspace/backend/auth';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ProductModel.name, schema: ProductSchema },
            { name: UserModel.name, schema: UserSchema }
        ]),
        JwtModule,
        AuthModule
    ],
    controllers:[ProductController],
    providers: [ProductService],
    exports: [ProductService],  
})

export class BackendFeaturesProductModule {}