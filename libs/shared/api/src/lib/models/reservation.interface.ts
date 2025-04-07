import { Product } from "@sharemunity-workspace/backend/features";
import { Id } from "./id.type";
import { IUser, IUserIdentity } from "./user.interface";
import { IProduct } from "./product.interface";

type Owner = IUser;
type Enjoyer = IUser;

export enum ReservationStatus{
    Pending = "Pending",
    Accepted = "Accepted",
    Declined = "Declined"
}

export interface IReservation{
    id:Id,
    product:IProduct
    owner:Owner,
    enjoyer:Enjoyer,
    message:string,
    pickup_date:Date,
    end_date:Date;
    reservation_status:ReservationStatus;
}

export type ICreateReservation = Pick<
IReservation,
    'product'|'message'| 'pickup_date' | 'end_date'
>;

export type IUpdateReservation = Partial<Omit<IReservation, 'id'>>;
export type IUpsertReservation = IReservation;

