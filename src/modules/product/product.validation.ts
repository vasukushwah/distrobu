import Joi from 'joi';
import { password, objectId } from '../validate/custom.validation';
import { NewCreatedProduct } from './product.interfaces';

const createProductBody: Record<keyof NewCreatedProduct, any> = {
    name: Joi.string().required(),
    available: Joi.boolean().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    imagePath: Joi.string().required(),
    model: Joi.string().required(),
    price: Joi.number().greater(0),
    quntity: Joi.number().greater(0)
};

export const createProduct = {
    body: Joi.object().keys(createProductBody),
};

export const getProducts = {
    query: Joi.object().keys({
        name: Joi.string(),
        model: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

export const getProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId),
    }),
};

export const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            password: Joi.string().custom(password),
            name: Joi.string(),
        })
        .min(1),
};

export const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};
