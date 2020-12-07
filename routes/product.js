const express = require('express');
const productRouter = express.Router();
const { getProductById } = require('../db');

productRouter.use((req, res, next) => {
  console.log("A request is being made to /product");
  next(); 
});

productRouter.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    try {
        const productById = await getProductById(id);
        res.send(productById);
    } catch (error) {
       next(error);
    }
});

module.exports = productRouter;