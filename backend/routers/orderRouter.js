import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel';
import Product from '../models/productModel';
import User from '../models/userModel';
import { isAdmin, isAuth } from '../util';

const orderRouter = express.Router();

orderRouter.get(
  '/summary',
  isAuth, 
  isAdmin,
  expressAsyncHandler( async(req, res) => {
    const paidOrders = await Order.find({isPaid: true})
    const orders = 
      {
        numOrders: paidOrders.length,
        totalSales: paidOrders.map(paidOder => paidOder.totalPrice).reduce((a, b) => a + b, 0),
      };
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: {$sum:1},
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: {$dateToString:{format: '%Y-%m-%d', date: '$createdAt'}},
          numOrders: {$sum:1},
          sales: {$sum: '$totalPrice'},
          sortNumber: {$sum: null}
        },
      },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: {$sum:1},
        },
      },
    ])
    res.send({users, orders, dailyOrders, productCategories});
  }),
);

orderRouter.get(
  '/mine', 
  isAuth, 
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id});
    res.send(orders);
  }),
);

orderRouter.get(
  '/:id', 
  isAuth, 
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({message: 'Order Not Found!'});
    }
  }),
);

orderRouter.get( 
  '/',
  isAuth,
  isAdmin, 
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user');
    if (orders) {
      res.send(orders);
    } else {
      res.status(404).send({message: 'Order Not Found!'});
    }
  }),
);

orderRouter.post(
  '/', 
  isAuth, 
  expressAsyncHandler(async (req, res) => {
    const order = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).send({message: 'New Order Created', order: createdOrder});
  }),
);

orderRouter.delete(
  '/:id',
  isAuth, 
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);    
    if (!order) {
      res.status(404).send({
        message: 'Order Not Found',
      });
    } else {
      const deletedOrder = await order.remove();
      if (deletedOrder) {
        res.send({message: 'Order Deleted', order: deletedOrder});
      } else {
        res.status(505).send({message: 'Error in deleting order'})
      }  
    };
  }),
);

orderRouter.put(
  '/:id/pay', 
  isAuth, 
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.payment.paymentResult = {
        payerID: req.body.payerID,
        paymentID: req.body.paymentID,
        orderID: req.body.orderID,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order not found!' });
    }
  }),
);

orderRouter.put(
  '/:id/deliver', 
  isAuth, 
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order not found!' });
    }
  }),
);

export default orderRouter;