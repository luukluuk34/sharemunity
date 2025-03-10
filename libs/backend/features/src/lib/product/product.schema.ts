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

    @Prop({required:true, default: 0})
    maxUseTime!: number;

    @Prop({required:true})
    images:IImage[] = [];

    @Prop({ required: true, type: String,enum:ProductStatus, default:ProductStatus.Available })
    status!: ProductStatus;
}

@Schema()
export class Image implements IImage {

    @Prop({required:true})
    filename!: string;

    @Prop({required:true})
    encoding!: string;

    @Prop({required:true})
    mimetype!: string;

    @Prop({required:true})
    path!:string;
    
    @Prop({required:true})
    size!:number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
