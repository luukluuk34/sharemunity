import { Product } from "@sharemunity-workspace/backend/features";
import { Id } from "./id.type";
import { IUserIdentity } from "./user.interface";
import { IProduct } from "./product.interface";

type Owner = IUserIdentity;
type Enjoyer = IUserIdentity;

export enum ReservationStatus{
    Pending = "Pending",
    Accepted = "Accepted",
    Declined = "Declined"
}

export interface IReservaton{
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
IReservaton,
    'product'|'message'| 'pickup_date' | 'end_date'
>;

export type IUpdateReservation = Partial<Omit<IReservaton, 'id'>>;
export type IUpsertReservation = IReservaton;

