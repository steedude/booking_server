import { Schema, model } from 'mongoose';

const productSchema = new Schema({});

const Product = model('Product', productSchema);

export { Product };
