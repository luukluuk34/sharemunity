import { IEntity } from 'libs/sharemunity/common/src/lib/entity/entity.model';
import { IProduct } from './product.interface';
import { IToken, IUserRegistration } from './auth.interface';
import { Id } from './id.type';

export enum UserRole {
    Guest = 'Guest',
    Admin = 'Admin',
    Unknown = 'Unknown'
}

/**
 * Minimal user information
 */

export interface IUserIdentity extends IEntity {
    emailAddress: string;
    role: UserRole;
    token?: string;
}

/**
 * All user information, excl. domain entities
 */
export interface IUserInfo extends IUserRegistration {
    _id: Id;
    address:string;
    role: UserRole;
}

/**
 * All user information, incl. domain entities
 */
export interface IUser extends IUserInfo {
    products: IProduct[];
}

export type ICreateUser = Pick<IUser, 'password' | 'emailAddress'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
