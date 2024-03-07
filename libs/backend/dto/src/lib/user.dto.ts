import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import {
    // ICreateUser,
    IUpdateUser,
    IUpsertUser,
    IUserRegistration,
    Id,
    UserRole
} from '@sharemunity-workspace/shared/api';
import { Product } from '@sharemunity-workspace/backend/features';

export class CreateUserDto implements IUserRegistration {
    @IsString()
    @IsNotEmpty() 
    name!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    emailAddress!: string;
}

export class UpsertUserDto implements IUpsertUser {

    _id!: Id;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    emailAddress!: string;

    @IsString()
    @IsNotEmpty()
    address!: string;

    @IsString()
    @IsNotEmpty()
    role: UserRole = UserRole.Unknown;


    @IsString()
    @IsNotEmpty()
    products: Product[] = [];

    @IsNumber()
    @IsNotEmpty()
    phoneNumber!:Number;
}

export class UpdateUserDto implements IUpdateUser {
    _id?: string | undefined;

    @IsString()
    @IsOptional()
    name!: string;
}
