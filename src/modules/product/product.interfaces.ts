import { Document, Model, Types } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IProduct {

    name: string;
    imagePath: string;
    model: string;
    price: Number;
    category: Types.ObjectId;
    quntity: Number;
    description: string;
    available: boolean;

}


export interface IProductDoc extends IProduct, Document { }

export interface IProductModel extends Model<IProductDoc> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateProductBody = Partial<IProduct>;

export type NewCreatedProduct = Required<IProduct>

