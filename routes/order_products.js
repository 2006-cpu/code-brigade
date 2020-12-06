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

orderProductsRouter.patch('/orders_products/:orderProductId', async (req, res, next) => {

    try {
      await updateOrderProduct({
          id: req.params.orderProductId, 
          price: req.body.price,
          quantity: req.body.quantity
        });
        res.send(204)

    } catch ({ name, message }) {
      next({ name, message });
    }
  });

orderProductsRouter.post('/create-session', async (req, res) => {
    const token = req.body.token
    const userId = req.body.userId
    console.log('token: ', token)
    console.log("userId: ", userId)

    const cart = await getCartByUser(userId);
    console.log('cart: ', cart)
    let amount = 0
    cart.productList.forEach(product => {
        amount += product.cartPrice
    });
  const charge = await stripe.charges.create({
      source: token.id,
      currency: 'usd',
      amount: amount * 100

  });
  res.json(charge);

});

module.exports = orderProductsRouter;