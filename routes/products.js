const { getProductById } = require('../db');

const express = require('express');
const productsRouter = express.Router();

productsRouter.get('/products/:productId', async (req, res, next) => {
    const id = req.params.productId;
    try {
        const productById = await getProductById(id);
        res.send(productById);
    } catch (error) {
       next(error);
    }
})


module.exports = productsRouter;