const apiRouter = require('express').Router();
const { getAllProducts, getProductById } = require('../db');

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!"
  });
});

apiRouter.get('/products', async (req, res, next) => {
  try {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      const products = await getAllProducts();
      res.send(products);
  } catch (error) {
      next(error);
  }
})

apiRouter.get('/product/:productId', async (req, res, next) => {
  const id = req.params.productId;
  try {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      const productById = await getProductById(id);
      res.send(productById);
  } catch (error) {
     next(error);
  }
})

apiRouter.get('/')

module.exports = apiRouter;
