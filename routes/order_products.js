const express = require('express');
const orderProductsRouter = express.Router();
const { getOrderProductById, getOrderById, destroyOrderProduct } = require('../db');

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

module.exports = orderProductsRouter;