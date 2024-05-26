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
    filename!:string

    @IsString()
    @IsNotEmpty()
    encoding!: string;

    @IsString()
    @IsNotEmpty()
    mimetype!: string;

    @IsString()
    @IsNotEmpty()
    path!:string;

    @IsNumber()
    @IsNotEmpty()
    size!:number;
}

export class UpsertImageDto implements IUpsertImage {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    filename!:string

    @IsString()
    @IsNotEmpty()
    encoding!: string;
    
    @IsString()
    @IsNotEmpty()
    mimetype!: string;

    @IsString()
    @IsNotEmpty()
    path!:string;

    @IsNumber()
    @IsNotEmpty()
    size!:number;

}
export class UpdateImageDto implements IUpdateImage {
    @IsString()
    @IsNotEmpty()
    filename!:string
}
