import { Model } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IProduct {
    productCode: string;
    title: string;
    imagePath: string;
    model: string;
    price: Number;
    category: any;
    quntity: Number;
    description: string;
    available: boolean;
}

export interface IProductModel extends Model<IProduct> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export interface IProducts {
    products: Array<IProduct>;
}
