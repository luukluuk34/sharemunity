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
    IUserIdentity,
    ProductStatus
} from '@sharemunity-workspace/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateProductDto implements ICreateProduct {
    @IsString()
    @IsNotEmpty()
    owner!: IUserIdentity;

    @IsString()
    @IsNotEmpty()
    enjoyer!: IUserIdentity;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsDate()
    @IsNotEmpty()
    maxUseTime!: Date;

    @IsString()
    @IsNotEmpty()
    status!: ProductStatus;
}

export class UpsertProductDto implements IUpsertProduct {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    owner!: IUserIdentity;

    @IsString()
    @IsNotEmpty()
    enjoyer!: IUserIdentity;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsDate()
    @IsNotEmpty()
    maxUseTime!: Date;

    @IsString()
    @IsNotEmpty()
    status!: ProductStatus;
}

export class UpdateProductDto implements IUpdateProduct {
    @IsString()
    @IsNotEmpty()
    enjoyer!: IUserIdentity;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsDate()
    @IsNotEmpty()
    maxUseTime!: Date;

    @IsString()
    @IsNotEmpty()
    status!: ProductStatus;
}
