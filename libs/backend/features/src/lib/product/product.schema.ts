import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ProductStatus } from '@sharemunity-workspace/shared/api';
import { IProduct } from '@sharemunity-workspace/shared/api'
import { IsMongoId } from 'class-validator';

export type ProductDocument = Product & Document;

@Schema()
export class Product implements IProduct {
    @IsMongoId()
    id!: string;
    @Prop({required:true})
    owner!: string;
    @Prop()
    enjoyer!: string;
    @Prop({required:true})
    name!: string;
    @Prop({required:true})
    description!: string;
    @Prop({required:true, default: new Date()})
    maxUseTime: Date = new Date();
    @Prop({ required: true, type: Object })
    status!: ProductStatus;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
