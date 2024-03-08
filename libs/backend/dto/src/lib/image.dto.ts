import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsDate,
    IsNumber,
    isNotEmpty,
    IsObject
} from 'class-validator';
import {
    ICreateImage,
    IUpdateImage,
    IUpsertImage,
} from '@sharemunity-workspace/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateImageDto implements ICreateImage {
    @IsString()
    @IsNotEmpty()
    name!:string
    
    @IsString()
    @IsNotEmpty()
    type!:string
    
    @IsNotEmpty()
    data!:Buffer
}

export class UpsertImageDto implements IUpsertImage {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    name!:string
    
    @IsString()
    @IsNotEmpty()
    type!:string
    
    @IsNotEmpty()
    data!:Buffer
}

export class UpdateImageDto implements IUpdateImage {
    @IsString()
    @IsNotEmpty()
    name!:string
    
    @IsString()
    @IsNotEmpty()
    type!:string
    
    @IsNotEmpty()
    data!:Buffer
}
