import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IProduct, IReservaton, IUserIdentity, ReservationStatus } from '@sharemunity-workspace/shared/api';
import { IsMongoId } from 'class-validator';

export type ReservationtDocument = Reservation & Document;

@Schema()
export class Reservation implements IReservaton {
    @IsMongoId()
    id!: string;

    @Prop({required:true,type:MongooseSchema.Types.ObjectId, ref:'Product'})
    product!:IProduct;

    @Prop({required:true,type:MongooseSchema.Types.ObjectId, ref:'User'})
    owner!: IUserIdentity;
    
    @Prop({required:true,type:MongooseSchema.Types.ObjectId, ref:'User'})
    enjoyer!: IUserIdentity;
    
    @Prop({required:true})
    message!: string;
    
    @Prop({required:true})
    pickup_date!: Date;

    @Prop({required:false})
    end_date!: Date;

    @Prop({ required: true, type: String,enum:ReservationStatus, default:ReservationStatus.Pending})
    reservation_status!: ReservationStatus;
}


export const ReservationSchema = SchemaFactory.createForClass(Reservation);
