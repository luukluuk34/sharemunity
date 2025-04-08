import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsDate,
    IsNumber
} from 'class-validator';
import {
    ICreateProduct,
    IUpdateProduct,
    IUpsertProduct,
    IUser,
    IUserIdentity,
    ProductStatus
} from '@sharemunity-workspace/shared/api';
import { Image } from '@sharemunity-workspace/backend/features';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateProductDto implements ICreateProduct {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsDate()
    @IsNotEmpty()
    maxUseTime!: number;

    @IsNotEmpty()
    images!: Image[];

}

export class UpsertProductDto implements IUpsertProduct {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    owner!: IUser;

    @IsString()
    @IsNotEmpty()
    enjoyer!: IUser;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsDate()
    @IsNotEmpty()
    maxUseTime!: number;

    @IsString()
    @IsNotEmpty()
    status!: ProductStatus;

    @IsNotEmpty()
    images!: Image[];
}

export class UpdateProductDto implements IUpdateProduct {
    @IsString()
    @IsNotEmpty()
    enjoyer!: IUser;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsDate()
    @IsNotEmpty()
    maxUseTime!:number;

    @IsString()
    @IsNotEmpty()
    status!: ProductStatus;

    @IsNotEmpty()
    images!: Image[];
}
