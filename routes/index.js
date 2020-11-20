const apiRouter = require('express').Router();
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'codebrigaderules'

const { getAllProducts,
        getProductById,
        createUser,
        getUser,
        getUserByUsername } = require('../db');

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!"
  });
});

apiRouter.get('/products', async (req, res, next) => {
  try {
      const products = await getAllProducts();
      res.send(products);
  } catch (error) {
      next(error);
  }
})

apiRouter.get('/product/:productId', async (req, res, next) => {
  const id = req.params.productId;
  try {
      const productById = await getProductById(id);
      res.send(productById);
  } catch (error) {
     next(error);
  }
})

apiRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
    });
  }
  try {
    const user = await getUser({username, password})

    if (!user) {
      next({
      name: 'Invalid',
      message: 'No match'
      });
    }

    if (user) {
      const token = jwt.sign({ 
        id: user.id, 
        username: user.username
        }, JWT_SECRET, {
        expiresIn: '1w'
        });
   
      res.send({ 
        user,
        message: "you're logged in!",
        token  
      });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

apiRouter.post('/register', async (req, res, next) => {
  const { firstName, lastName, email, imageurl, username, password, isAdmin } = req.body;

    if (password.length < 8) {
      return next({
        name: 'PasswordError',
        message: "Password Too Short!"
      });
    }   
  
    const _user  = await getUserByUsername(username)
    if (_user) {
      return next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
        });
    }
  try {
    const user = await createUser({firstName, lastName, email, imageurl, username, password, isAdmin})
    const token = jwt.sign({  
      id: user.id,
      username: user.username
      }, JWT_SECRET, {
      expiresIn: '1w'
      });

    if (token) { 
      res.send({user
      ,token})
    }          
  } catch ({ name, message }) {
    next({ name, message })
  }  
});


module.exports = apiRouter;