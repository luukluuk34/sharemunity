import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ICommunity, IImage, IProduct, IUserIdentity } from "@sharemunity-workspace/shared/api";
import { IsMongoId } from "class-validator";
import { Image } from "../product/product.schema";

export type CommunityDocument = Community & Document;


@Schema()
export class Community implements ICommunity {
    
    @IsMongoId()
    id!: string;
    
    @Prop({required:true,type:MongooseSchema.Types.ObjectId, ref:'User'})
    owner!: IUserIdentity;
    
    @Prop({required:true})
    name!: string;
    
    @Prop({required:true})
    description!: string;
    
    @Prop({required:true})
    communityImage!: Image;
    
    @Prop({required:true, default:Date.now()})
    creationDate!: Date;
    
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
    members!: IUserIdentity[];
    
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }], default: [] })
    products!: IProduct[];
    
}

export const CommunitySchema = SchemaFactory.createForClass(Community);