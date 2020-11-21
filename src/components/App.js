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
} from './index';

import {
  getAllProducts
} from '../api';

const App = () => {
  const [productList, setProductList] = useState([]);
  const [token, setToken] = useState('')

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
      <h1>Hello</h1>
      <NavBar setToken={setToken} token={token} />
        <Switch>
          <Route path="/login">
            <Login setToken={setToken} token={token}/>
          </Route>
          <Route path="/register">
              <Register setToken={setToken} token={token}/>
          </Route>
          <Route path="/product/:productId">
              <Product productList={productList}/>
          </Route>
          <Route path="/products">
              <Products productList={productList}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;