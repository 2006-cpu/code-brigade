const express = require('express');
const orderProductsRouter = express.Router();
const { getOrderProductById, getOrderById, destroyOrderProduct, updateOrderProduct, getCartByUser } = require('../db');
const stripe = require('stripe')('sk_test_51HswdxHuqx5U03uj8qx7Fh5fgQljGXnvJ0Tm0bAq52BeU6IzL9K4bOnlXY0aNTzwj9LGFwaXuD0xsXeEzPyJSD9v00PbuzKdpq');

orderProductsRouter.delete('/:orderProductId', async (req, res, next) => {
    const { orderProductId } = req.params;
    try {
        const orderProduct = await getOrderProductById(orderProductId);
        const order = await getOrderById(orderProduct.orderId);
        if(orderProduct && order.userId === req.user.id) {
            const deletedOrderProduct = await destroyOrderProduct(orderProductId);
            res.send(deletedOrderProduct); 
        } else if(orderProduct){
            next({ 
                name: 'NotAllowed', 
                message: 'Sorry it was not deleted because you are not the owner'
                }) 
        } else if (!orderProduct){
            next({ 
                name: 'NotAvailable', 
                message: 'That order does not exist'
              });
        }
           
    } catch (error) {
        next(error);
    }
});

orderProductsRouter.patch('/:orderProductId', async (req, res, next) => {
    const { orderProductId } = req.params;
    const { price, quantity } = req.body;
      try {
        const orderProduct = await updateOrderProduct({id: orderProductId, price, quantity})   
        if(orderProduct) {
            res.send(orderProduct);
        }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

orderProductsRouter.post('/create-session', async (req, res) => {
    const token = req.body.token
    console.log('token: ', token)
    const cart = getCartByUser(5);
    console.log('cart: ', cart)
  const charge = await stripe.charges.create({
      source: token.id,
      currency: 'usd'

// notes
// need to get userId correctly (there is no cart for the user)
// need to pass in amount from cart

  });
  res.json(charge);

});

module.exports = orderProductsRouter;