const express = require('express');
const ordersRouter = express.Router();
const { getAllOrders, getCartByUser, createOrder, getOrderById, addProductToOrder, getOrderProductByOrderIdProductIdPair, updateOrder, cancelOrder, completeOrder, getCartByOrderId } = require('../db');
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

  ordersRouter.patch('/:orderId', async (req, res, next) => {
    const { orderId } = req.params;
    const {status, userId} = req.body
    try {     
            const updatedOrder = await updateOrder({id: orderId, ...req.body});
            res.send(updatedOrder);    
    } catch (error) {
        next(error);
    }
  });

  ordersRouter.delete('/:orderId', requireUser, async (req, res, next) => {
    const id = req.params.orderId;
    try {
            const order = await getOrderById(id)

            if (order && order.userId === req.user.id ) {
               const cancelledOrder = await cancelOrder(order.id); 

               res.send(cancelledOrder);
            } else {
                next(order ? {
                    name: "UnauthorizedUserError",
                    message: "You cannot cancel an order which is not yours"
                } : {
                    name: "OrderNotFoundError",
                    message: "That order does not exist"
                });
            } 
    } catch (error) {
        next(error);
    }
});

ordersRouter.delete('/cart/:orderId', async (req, res, next) => { 
    const  id = req.params.orderId;
    try {
            const cartByOrderId = await getCartByOrderId(id);

            if (cartByOrderId && cartByOrderId.userId === req.user.id) {
               const completedOrder = await completeOrder(cartByOrderId.id); 

               res.send(completedOrder);
            } else {
                next(cartByOrderId ? {
                    name: "UnauthorizedUserError",
                    message: "You cannot complete an order which is not yours"
                    } : {
                    name: "CartNotFoundError", 
                    message: "That cart does not exist"
                });
            } 
    } catch (error) {
        next(error); 
    }
});

module.exports = ordersRouter;