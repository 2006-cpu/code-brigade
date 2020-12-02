import React, { useState, useEffect } from 'react';

//new for localStorage
import {  getCurrentUser, getCurrentToken } from '../auth';
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
  SingleOrder,
  Orders,
  Cart,
  GuestCart,
} from './index';

//new 
import { getCurrentCart } from '../auth';

import {
  getAllProducts, 
  getCartByUser
} from '../api';

const App = () => {
  const [productList, setProductList] = useState([]);
  const [token, setToken] =  useState(getCurrentToken() || '')
  // useState('');
  const [user, setUser] = useState(getCurrentUser())
  //for localStorage
  console.log("WHAT is localStorage", getCurrentUser())
  // useState({});
  const [ shoppingCart, setShoppingCart ] = useState([]); 
  const [ orderId, setOrderId ] = useState(shoppingCart.id)
  const [ oldGuestCart, setOldGuestCart ] = useState(getCurrentCart())

  const fetchProducts = async () => {
    try {
      const products = await getAllProducts();
      setProductList(products);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchCart = async () => {
    try {
      const cart = await getCartByUser(token);
      setShoppingCart(cart.data);
      setOrderId(cart.data.id);
    } catch (error) {
      
    }
  }

useEffect(() => {
    fetchProducts();
}, []);

useEffect(() => {
  fetchCart();
}, [token]);

  return (
    <Router>
      <div className="App">
      <h1>Masks Co.</h1>
      <NavBar user={user} setUser={setUser} token={token} setToken={setToken} setShoppingCart={setShoppingCart} setOrderId={setOrderId}/>
        <Switch>
          <Route path="/Login">
            <Login setUser={setUser} token={token} setToken={setToken} setOrderId={setOrderId}/>
          </Route>
          <Route path="/register">
              <Register user={user} setUser={setUser} setToken={setToken} setOrderId={setOrderId}/>
          </Route>
          {user && token && 
            <Route path="/account">
              <Account user={user} />
            </Route>
          }
          <Route path="/product/:productId">
              <Product productList={productList}/>
          </Route>
          <Route path="/products">
              <Products productList={productList} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} user={user} orderId={orderId} setOrderId={setOrderId}/>
          </Route>
          <Route exact path="/cart">
              <Cart user={user} token={token} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} orderId={orderId} setOrderId={setOrderId}/>
          </Route>
          <Route path="/guestcart">
              <GuestCart user={user} token={token} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} orderId={orderId} setOrderId={setOrderId}  oldGuestCart={oldGuestCart} setOldGuestCart={setOldGuestCart}/>
          </Route>            
          <Route exact path="/orders">
            <Orders user={user} />
          </Route>
          <Route exact path="/orders/:orderId">
            <SingleOrder user={user} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;