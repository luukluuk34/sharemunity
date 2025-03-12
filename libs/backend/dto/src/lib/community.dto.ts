import { ICreateCommunity, IImage, IProduct, IUpdateCommunity, IUpsertCommunity, IUserIdentity } from "@sharemunity-workspace/shared/api";
import { IsDate, IsNotEmpty, IsString } from "class-validator";


export class CreateCommunityDto implements ICreateCommunity {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @IsNotEmpty()
    communityImage!: IImage;
}

export class UpsertCommunityDto implements IUpsertCommunity{
    @IsString()
    @IsNotEmpty()
    id!: string;
    
    @IsString()
    @IsNotEmpty()
    owner!: IUserIdentity;
    
    @IsString()
    @IsNotEmpty()
    name!: string;
    
    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @IsNotEmpty()
    communityImage!: IImage;
    
    @IsDate()
    @IsNotEmpty()
    creationDate!: Date;
    
    @IsString()
    members!: IUserIdentity[];
    
    @IsString()
    products!: IProduct[];

}

export class UpdateCommunityDto implements IUpdateCommunity{

    @IsString()
    @IsNotEmpty()
    name!: string;
    
    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @IsNotEmpty()
    communityImage!: IImage;
    
    @IsDate()
    @IsNotEmpty()
    creationDate!: Date;
    
    @IsString()
    members!: IUserIdentity[];
    
    @IsString()
    products!: IProduct[];
}