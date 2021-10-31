/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import express from "express";
import expressAsyncHandler from 'express-async-handler';
import User from "../models/userModel";
import { generateToken, isAuth } from "../util";

const userRouter = express.Router();

// construct admin data profile
userRouter.get(
  '/createadmin', 
  expressAsyncHandler (async (req, res) => {
    try {
      const user = new User({
        name: 'admin',
        email: 'admin@example.com',
        password: 'abc',
        isAdmin: true,
      });
      const createdUser = await user.save();
      res.send(createdUser);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
  }));

// create router to a server that store the data profile--
// --of user that already constructed
userRouter.post(
  '/signin', 
  expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
      email: req.body.email,
      password: req.body.password
    });
    if (!signinUser) {
      res.status(401).send({
        message: 'Invalid Email or Password',
      });
    } else {
      res.send({
        _id: signinUser._id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: generateToken(signinUser),
      });
    }
  })
); 

userRouter.post(
  '/register', 
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const createdUser = await user.save();
    if (!createdUser) {
      res.status(401).send({
        message: 'Invalid User data',
      });
    } else {
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth, 
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);    
    if (!user) {
      res.status(401).send({
        message: 'Invalid User Data',
      });
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);
export default userRouter;
