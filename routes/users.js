const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'codebrigaderules';

const { createUser,
        getUser,
        getUserByUsername,
        getUserById,
        getOrdersByUser
        } = require('../db/')

        
usersRouter.use((req, res, next) => {
    console.log("REQUEST is being made to /users");
    next();
});


usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
      if (!username || !password) {
        next({
          name: "MissingCredentialsError",
          message: "Please supply both a username and password"
      });
    }
    try {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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

  
usersRouter.post('/register', async (req, res, next) => {
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
      // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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


usersRouter.get('/me', async (req, res, next) => {
    try {
      const data =  await getUserById(req.user.id)
  
      if (data) {
      res.send(data);
      }
    
    } catch ({ name, message }) {
      next({ name, message })
    }
});


usersRouter.get('/:userId/orders', async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const ordersOfUser = await getOrdersByUser(userId)
    res.send(ordersOfUser);
  } catch ({ name, message }) {
    next({ name, message })
  }
});
  

module.exports = usersRouter;