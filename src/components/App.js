import React, { useState, useEffect } from 'react';

import NavBar from './NavBar';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import {
  Product,
  Products,
  Login,
  Register,
  Account,
  SingleOrder
} from './index';

import Cart from './Cart'

import {
  getAllProducts
} from '../api';

const App = () => {
  const [productList, setProductList] = useState([]);
  const [token, setToken] = useState('');
  const [user, setUser] = useState({});

  const fetchProducts = () => {
    getAllProducts()
    .then(products => {
        setProductList(products);
    })
    .catch(error => {
        console.error(error);
    });
  }

  useEffect(() => {
    fetchProducts();
}, []);

  return (
    <Router>
      <div className="App">
      <h1>Masks Co.</h1>
      <NavBar token={token} setToken={setToken}/>
        <Switch>
          <Route path="/Login">
            <Login setUser={setUser} token={token} setToken={setToken} />
          </Route>
          <Route path="/register">
              <Register user={user} setUser={setUser} setToken={setToken}/>
          </Route>
          <Route path="/account">
              <Account user={user} />
          </Route>
          <Route path="/product/:productId">
              <Product productList={productList}/>
          </Route>
          <Route path="/products">
              <Products productList={productList}/>
          </Route>

          <Route path="/cart">
              <Cart user={user} token={token}/>
          </Route>
          <Route path="/orders/:orderId">
            <SingleOrder />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;