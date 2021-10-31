import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';
import productRouter from './routers/productRouter';
import uploadRouter from './routers/uploadRouter';
import path from 'path';

mongoose
  .connect(
    config.MONGODB_URL, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,   
    })
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/uploads', uploadRouter)
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter)
app.get('/api/paypal/clientID', (req, res) => {
  res.send({ clientID: config.PAYPAL_CLIENT_ID })
})
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')))
app.use(express.static(path.join(__dirname, '/../frontend')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../frontend/index.html'));
})

app.use((err, req, res, next) => {
  const status = err.name && err.name === 'ValidationError'? 400: 500;
  res.status(status).send({message: err.message});
});
app.listen(config.PORT, () => {
  console.log('serve at http://localhost:5000');
});

