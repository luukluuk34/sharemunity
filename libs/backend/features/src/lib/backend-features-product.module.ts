import { FileTypeValidator, MaxFileSizeValidator, Module, ParseFilePipe } from "@nestjs/common";
import { ProductController } from "./product/product.controller";
import { ProductService } from "./product/product.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User as UserModel, UserSchema } from '@sharemunity-workspace/backend/user';
import { Product as ProductModel, ProductSchema } from './product/product.schema';
import { Reservation as ReservationModel, ReservationSchema } from "./reservation/reservation.schema";
import { Community as CommunityModel, CommunitySchema} from './community/community.schema';
import { AuthModule } from '@sharemunity-workspace/backend/auth';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseModule } from "./firebase/firebase.module";
import { FirebaseService } from "./firebase/firebase.service";
import { ReservationController } from "./reservation/reservation.controller";
import { ReservationService } from "./reservation/reservation.service";
import { ConfigModule } from "@nestjs/config";
import { CommunityController } from "./community/community.controller";
import { CommunityService } from "./community/community.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ProductModel.name, schema: ProductSchema },
            { name: ReservationModel.name,schema:ReservationSchema},
            { name: CommunityModel.name, schema:CommunitySchema},
            { name: UserModel.name, schema: UserSchema },
        ]),
        JwtModule,
        AuthModule,
        FirebaseModule
    ],
    controllers:[ProductController,ReservationController,CommunityController],
    providers: [ProductService,ReservationService,CommunityService],
    exports: [ProductService,ReservationService, CommunityService],  
})


export class BackendFeaturesProductModule {}