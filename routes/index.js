const apiRouter = require('express').Router();
const jwt = require('jsonwebtoken')
const JWT_SECRET =  process.env.JWT_SECRET || 'codebrigadez';

const { getUserById } = require('../db');

apiRouter.get("/", (req, res) => {
  res.send({
    message: "API is under construction!"
  });
});

apiRouter.get('/masks', (req, res, next) => {
  res.send({message: 'All is safe'});
});

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { 
  next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
    const { id } = jwt.verify(token, JWT_SECRET);

    if (id) {
      req.user = await getUserById(id);
      next();
    }
    } catch ({ name, message }) {
    next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});


apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});


const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

const productRouter = require('./product');
apiRouter.use('/product', productRouter);

const ordersRouter = require('./orders');
apiRouter.use('/orders', ordersRouter);

const orderProductsRouter = require('./order_products');
apiRouter.use('/order_products', orderProductsRouter);

module.exports = apiRouter;