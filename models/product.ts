import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  image: {
    type: [Buffer],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projector: {
    type: Boolean,
    required: true,
  },
  television: {
    type: Boolean,
    required: true,
  },
  window: {
    type: Boolean,
    required: true,
  },
  is_confirmed: {
    type: Boolean,
    required: true,
  },
});

const Product = model('Product', productSchema);

export { Product };
