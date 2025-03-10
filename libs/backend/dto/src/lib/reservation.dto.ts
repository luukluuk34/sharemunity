import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsMongoId,
} from 'class-validator';
import {
    ICreateReservation,
    IProduct,
    IUpdateReservation,
    IUpsertReservation,
    IUserIdentity,
    ReservationStatus
} from '@sharemunity-workspace/shared/api';

export class CreateReservationDto implements ICreateReservation {

    @IsString()
    @IsNotEmpty()
    product!:IProduct;

    @IsString()
    @IsNotEmpty()
    message!: string;
    
    @IsDate()
    @IsNotEmpty()
    pickup_date!: Date;

    @IsDate()
    end_date!: Date;

}

export class UpsertReservationDto implements IUpsertReservation {
    @IsMongoId()
    id!: string;

    @IsString()
    @IsNotEmpty()
    product!:IProduct;

    @IsString()
    @IsNotEmpty()
    owner!: IUserIdentity;

    @IsString()
    @IsNotEmpty()
    enjoyer!: IUserIdentity;
    
    @IsString()
    @IsNotEmpty()
    message!: string;
    
    @IsDate()
    @IsNotEmpty()
    pickup_date!: Date;

    @IsDate()
    end_date!: Date;

    @IsNotEmpty()
    @IsString()
    reservation_status!: ReservationStatus;

}

export class UpdateReservationDto implements IUpdateReservation {

    @IsString()
    @IsNotEmpty()
    product!:IProduct;

    @IsString()
    @IsNotEmpty()
    enjoyer!: IUserIdentity;
    
    @IsString()
    @IsNotEmpty()
    message!: string;
    
    @IsDate()
    @IsNotEmpty()
    pickup_date!: Date;

    @IsDate()
    end_date!: Date;

    @IsNotEmpty()
    @IsString()
    reservation_status!: ReservationStatus;
}
