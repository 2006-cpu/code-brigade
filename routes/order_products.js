const express = require('express');
const orderProductsRouter = express.Router();
const { getOrderProductById, getOrderById, destroyOrderProduct, updateOrderProduct } = require('../db');
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_API_KEY);

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
    const orderId = req.body.orderId

    const cart = await getOrderById(orderId);
    let amount = 0
    cart.productList.forEach(product => {
        amount += product.price
    });
  const charge = await stripe.charges.create({
      source: token.id,
      currency: 'usd',
      amount: amount * 100

  });
  res.json(charge);

});

module.exports = orderProductsRouter;