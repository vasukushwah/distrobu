import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IProduct, IProductDoc, NewCreatedProduct, UpdateProductBody } from './product.interfaces';
import Product from './product.model';




/**
 * Create a product
 * @param {NewCreatedProduct} userBody
 * @returns {Promise<IProductDoc>}
 */

export const createProduct = async (productBody: NewCreatedProduct) => {
    if (productBody.price < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Price is less then 0');
    }
    if (productBody.quntity < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Quntity is less then 0')
    }
    return Product.create(productBody)
}


/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
    const products = await Product.paginate(filter, options);
    return products;
};

/**
 * Get product by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProductDoc | null>}
 */
export const getProductById = async (id: mongoose.Types.ObjectId): Promise<IProductDoc | null> => Product.findById(id);


/**
 * Get all products
 * @returns {Promise<Array<IProduct> | null>}
 */
export const getProducts = async (): Promise<Array<IProduct> | null> => Product.find({});

/**
 * Update product by id
 * @param {mongoose.Types.ObjectId} productId
 * @param {UpdateProductBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateProductById = async (
    productId: mongoose.Types.ObjectId,
    updateBody: UpdateProductBody
): Promise<IProductDoc | null> => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    Object.assign(product, updateBody);
    await product.save();
    return product;
};

/**
 * Delete product by id
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<IProductDoc | null>}
 */
export const deleteProductById = async (productId: mongoose.Types.ObjectId): Promise<IProductDoc | null> => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    await product.remove();
    return product;
};



