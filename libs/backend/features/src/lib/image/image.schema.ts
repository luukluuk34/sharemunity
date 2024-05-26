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

export const ImageSchema = SchemaFactory.createForClass(Image);
