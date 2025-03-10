import { Id } from "./id.type";

export interface IImage{
    filename:string,
    encoding:string,
    mimetype:string;
    path:string;
    size:number;
}


export type ICreateImage = Pick<
    IImage,
    'filename'| 'encoding' | 'mimetype' | 'path'| 'size'
>;

export type IUpdateImage = Partial<IImage>;
export type IUpsertImage = IImage;

