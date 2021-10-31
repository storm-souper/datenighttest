import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    category: {type: String, required: true},
    brand: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, default: 0.0, required: true},
    countInStocks: {type: Number, default:0, required: true},
    rating: {type: Number, default: 0.0, required: true},
    numReviews: {type: Number, default: 0.0, required: true},
  }, 
  {  timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
Product.remove({image: 'sample image'})
export default Product;
