const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET =  process.env.JWT_SECRET || 'codebrigadez';

const { createUser,
        getUser,
        getUserByUsername,
        getUserById,
        getOrdersByUser,
        getAllUsers, 
        updateUser,
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
        message: 'No match with that username and password combination'
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

//Dec 3
usersRouter.get('/', async (req, res, next) => {
  try {
      const users = await getAllUsers();
      res.send(users);
  } catch (error) {
      next(error);
  }
});

//Dec 3
usersRouter.patch('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  const { firstName, lastName, email, imageurl, username, password, isAdmin } = req.body
    try {     
        const updatedUser = await updateUser({id: userId, firstName, lastName, email, imageurl, username, password, isAdmin});
        res.send(updatedUser);
    } catch (error) {
      next(error);
  }
});

//Dec 3 getUserbyId for admin
usersRouter.get('/user/:userId', async (req, res, next) => {
  const id = req.params.userId;
  try {
      const userById = await getUserById(id);
      if(userById) {
      res.send(userById);
      }
  } catch (error) {
     next(error);
  }
});
  

module.exports = usersRouter;