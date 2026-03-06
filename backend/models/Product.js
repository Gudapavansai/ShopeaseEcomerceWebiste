import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: [String],
  image: [String],
  date: { type: Date, default: Date.now },
  bestseller: { type: Boolean, default: false },
  stock: { type: Number, default: 100 }
}, { _id: false });

const Product = mongoose.model('Product', productSchema);

export default Product;
