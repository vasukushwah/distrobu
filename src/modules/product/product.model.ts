
import mongoose from 'mongoose'
import paginate from '../paginate/paginate';
import { toJSON } from '../toJSON';

import { IProductDoc, IProductModel } from './product.interfaces'

const productSchema = new mongoose.Schema<IProductDoc, IProductModel>({
    name: {
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

const Product = mongoose.model<IProductDoc, IProductModel>('Product', productSchema);

export default Product;


