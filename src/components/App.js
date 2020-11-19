import React, { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import {
  Product,
  Products
} from './index';

import {
  getSomething,
  getAllProducts
} from '../api';

const App = () => {
  // const [message, setMessage] = useState('');
  const [productList, setProductList] = useState([]);

  // useEffect(() => {
  //   getSomething()
  //     .then(response => {
  //       setMessage(response.message);
  //     })
  //     .catch(error => {
  //       setMessage(error.message);
  //     });
  // });

  const fetchProducts = () => {
    getAllProducts()
    .then(products => {
        setProductList(products);
        console.log('product:', products)
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
        <Switch>
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