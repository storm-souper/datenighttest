import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel';
import { isAdmin, isAuth } from '../util';

const productRouter = express.Router();
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  }),
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product);
  }),
);

productRouter.post(
  '/', 
  isAuth, 
  isAdmin, 
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample product',
      category: 'sample category',
      brand: 'sample brand',
      image: '/images/product-1.jpg',
    });
    const createdProduct = await product.save();
    if (createdProduct) {
      res.status(201).send({message: 'Product is Created', product: createdProduct});
    } else {
      res.status(502).send({message: 'Error in creating product'});
    }
  }),
);

productRouter.put(
  '/:id',
  isAuth, 
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);    
    if (!product) {
      res.status(401).send({
        message: 'Product Not Found',
      });
    } else {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.image = req.body.image || product.image;
      product.brand = req.body.brand || product.brand;
      product.countInStocks = req.body.countInStocks || product.countInStocks;
      product.category = req.body.category || product.category;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        res.send({message: 'Product Updated', product: updatedProduct});
      } else {
        res.status(505).send({message: 'Error in updating product'})
      }  
    };
  }),
);

productRouter.delete(
  '/:id',
  isAuth, 
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);    
    if (!product) {
      res.status(404).send({
        message: 'Product Not Found',
      });
    } else {
      const deletedProduct = await product.remove();
      if (deletedProduct) {
        res.send({message: 'Product Deleted', product: deletedProduct});
      } else {
        res.status(505).send({message: 'Error in deleting product'})
      }  
    };
  }),
);

export default productRouter;

