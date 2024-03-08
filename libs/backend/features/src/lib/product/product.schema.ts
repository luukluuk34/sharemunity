import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IImage, IUserInfo, ProductStatus } from '@sharemunity-workspace/shared/api';
import { IProduct } from '@sharemunity-workspace/shared/api'
import { IsMongoId } from 'class-validator';

export type ProductDocument = Product & Document;

@Schema()
export class Product implements IProduct {
    @IsMongoId()
    id!: string;

    @Prop({required:true,type:MongooseSchema.Types.ObjectId, ref:'User'})
    owner!: IUserInfo;

    @Prop({required:false,type:MongooseSchema.Types.ObjectId, ref:'User'})
    enjoyer!: IUserInfo;

    @Prop({required:true})
    name!: string;

    @Prop({required:true})
    description!: string;

    @Prop({required:true, default: new Date()})
    maxUseTime: Date = new Date();

    @Prop({
        default: [],
        type: [MongooseSchema.Types.ObjectId],
        ref: 'Images',
      })
    images:IImage[] = [];

    @Prop({ required: true, type: ProductStatus })
    status: ProductStatus = ProductStatus.Available;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
