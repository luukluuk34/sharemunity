import { FileTypeValidator, MaxFileSizeValidator, Module, ParseFilePipe } from "@nestjs/common";
import { ProductController } from "./product/product.controller";
import { ProductService } from "./product/product.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User as UserModel, UserSchema } from '@sharemunity-workspace/user';
import { Product as ProductModel, ProductSchema } from './product/product.schema';
import { Image as ImageModel, ImageSchema } from './image/image.schema';
import { AuthModule } from '@sharemunity-workspace/backend/auth';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseModule } from "./firebase/firebase.module";
import { FirebaseService } from "./firebase/firebase.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ProductModel.name, schema: ProductSchema },
            { name: UserModel.name, schema: UserSchema },
            { name: ImageModel.name, schema: ImageSchema}
        ]),
        JwtModule,
        AuthModule,
        FirebaseModule
    ],
    controllers:[ProductController],
    providers: [ProductService],
    exports: [ProductService],  
})


export class BackendFeaturesProductModule {}