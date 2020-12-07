const express = require('express');
const productsRouter = express.Router();
const   { updateProduct, createProduct, getAllProducts, destroyProduct } 
        = require('../db/')

productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (error) {
        next(error);
    }
  });

  productsRouter.patch('/:productId', async (req, res, next) => {
    const { productId } = req.params;
    try {     
            const updatedProduct = await updateProduct({id: productId, ...req.body});
            res.send(updatedProduct);    
    } catch (error) {
        next(error);
    }
  });

  productsRouter.post('/', async (req, res, next) => {
    try {     
            const createdProduct = await createProduct({...req.body});
            res.send(createdProduct);    
    } catch (error) {
        // next(error);
        res.send(400)
    }
  });

productsRouter.delete('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    try {
        const product = await destroyProduct(id);
        res.send(product);
    } catch (error) {
        next(error);
    }
})

  module.exports = productsRouter;