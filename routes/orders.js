const express = require('express');
const ordersRouter = express.Router();
const { getAllOrders, getCartByUser, createOrder, getOrderById, addProductToOrder, getOrderProductByOrderIdProductIdPair } = require('../db');
const { requireUser } = require('./utils');

ordersRouter.use((req, res, next) => {
    console.log("REQUEST is being made to /orders");
    next();
});


ordersRouter.get('/', async (req, res, next) => {
    try {
            const orders = await getAllOrders();
            res.send(orders);    
    } catch (error) {
        next(error);
    }
})

ordersRouter.get('/cart', requireUser, async (req, res, next) => {
    try {
        const cartByUserId = await getCartByUser(req.user.id);
        if (cartByUserId) {
        res.send(cartByUserId)
        }
    } catch (error) {
      next (error)
    }
})

ordersRouter.get('/:orderId', async (req, res, next) => {
   const id = req.params.orderId;
    try {
            const order = await getOrderById(id);
            res.send(order);    
    } catch (error) {
        next(error);
    }
})


ordersRouter.post('/', async (req, res, next) => {
    try {
        const {status, userId} = req.body
        const newOrder = await createOrder({status, userId});
          res.send(newOrder);
    } catch (error) {
    next(error);
    }
});

//orders/:orderId/products
ordersRouter.post('/:orderId/products', async (req, res, next) => {
    const { orderId } = req.params;
    const { productId, price, quantity } = req.body
  
    try { 
      const existingPair = await getOrderProductByOrderIdProductIdPair(orderId, productId)

      if (existingPair) {
      return next({
          name: 'DuplicateProduct',
          message: "You already have this in your cart"
       });
      }   

      const addProduct =  await addProductToOrder({ orderId, productId, price, quantity })
      
      if (addProduct) {
        res.send(addProduct);
      }  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });

module.exports = ordersRouter;