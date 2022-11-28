
import mongoose from 'mongoose'
import paginate from '../paginate/paginate';
import { toJSON } from '../toJSON';

import { IProduct, IProductModel } from './product.interfaces'

const productSchema = new mongoose.Schema<IProduct, IProductModel>({
    productCode: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    model: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    quntity: {
        type: Number,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },

})


// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model<IProduct, IProductModel>('Product', productSchema);

export default Product;


