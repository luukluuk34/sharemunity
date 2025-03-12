import { Id } from "./id.type";
import { IImage } from "./image.interface";
import { IProduct } from "./product.interface";
import { IUser, IUserIdentity } from "./user.interface";

type Owner = IUserIdentity;
type Member = IUserIdentity;

export interface ICommunity{
    id:Id,
    owner:Owner;
    name:string,
    description:string,
    communityImage:IImage,
    creationDate:Date,
    members:Member[],
    products:IProduct[]
}

export type ICreateCommunity = Pick<
ICommunity,
    'name' | 'description' | 'communityImage'  
>;

export type IUpdateCommunity = Partial<Omit<ICommunity, 'id'>>;
export type IUpsertCommunity = ICommunity;