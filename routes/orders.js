const express = require('express');
const ordersRouter = express.Router();
const { getAllOrders, getCartByUser } = require('../db');
const { requireUser } = require('./utils');

ordersRouter.use((req, res, next) => {
    console.log("REQUEST is being made to /orders");
    next();
});


ordersRouter.get('/', async (req, res, next) => {
    try {
            if(req.user.isAdmin){
                const orders = await getAllOrders();
            res.send(orders); 

            }   
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


module.exports = ordersRouter;