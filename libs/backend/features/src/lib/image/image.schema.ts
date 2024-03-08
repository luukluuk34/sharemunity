import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IUserInfo, ProductStatus } from '@sharemunity-workspace/shared/api';
import { IImage } from '@sharemunity-workspace/shared/api'
import { IsMongoId } from 'class-validator';

export type ImageDocument = Image & Document;

@Schema()
export class Image implements IImage {
    @IsMongoId()
    id!: string;

    @Prop({required:true})
    name!: string;

    @Prop({required:true})
    type!: string;

    @Prop({required:true})
    data!: Buffer;

}

export const ImageSchema = SchemaFactory.createForClass(Image);
