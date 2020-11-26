const express = require('express');
const ordersRouter = express.Router();
const { getAllOrders, getCartByUser, createOrder, getOrderById } = require('../db');
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


module.exports = ordersRouter;