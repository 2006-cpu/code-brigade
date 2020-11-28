const express = require('express');
const productsRouter = express.Router();
const   { getAllProducts, updateOrderProduct } 
        = require('../db/')

productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (error) {
        next(error);
    }
  })

  productsRouter.patch('/orders_products/:orderProductId', async (req, res, next) => {

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

  module.exports = productsRouter;