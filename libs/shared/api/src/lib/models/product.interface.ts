import {Id} from './id.type';
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
    maxUseTime:Date;
    status:ProductStatus;
}

export type ICreateProduct = Pick<
    IProduct,
    'owner'| 'enjoyer' | 'name' | 'description' | 'maxUseTime' | 'status'
>;

export type IUpdateProduct = Partial<Omit<IProduct, 'id'>>;
export type IUpsertProduct = IProduct;



