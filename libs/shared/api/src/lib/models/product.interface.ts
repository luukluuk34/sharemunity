import {Id} from './id.type';
import { IImage } from './image.interface';
import { IUserIdentity } from './user.interface';

export enum ProductStatus {
    Available = 'Available',
    Reserved = 'Reserved',
    InUse = 'InUse',
}

type Owner = IUserIdentity;
type Enjoyer = IUserIdentity;

export interface IProduct {
    id:Id;
    owner:Owner;
    enjoyer:Enjoyer;
    name:string;
    description:string;
    maxUseTime:number;
    status:ProductStatus;
    images:IImage[];
}

export type ICreateProduct = Pick<
    IProduct,
    'name' | 'description' | 'maxUseTime' | 'images'
>;

export type IUpdateProduct = Partial<Omit<IProduct, 'id'>>;
export type IUpsertProduct = IProduct;



