import { Id } from "./id.type";

export interface IImage{
    id:Id
    name:string,
    type:string,
    data:Buffer
}

export type ICreateImage = Pick<
    IImage,
    'name'| 'type' | 'data'
>;

export type IUpdateImage = Partial<Omit<IImage, 'id'>>;
export type IUpsertImage = IImage;

