import React, { useState, useEffect } from 'react';

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
  ManageProducts,
  Login,
  Register,
  Account,
  SingleOrder,
  Orders,
  OrdersByProduct,
  Cart,
  GuestCart,
  Users,
  SingleUser
} from './index';

import { getCurrentCart } from '../auth';

import {
  getAllProducts, 
  createInitialOrderId,
  getCartByUser
} from '../api';

const App = () => {
  const [productList, setProductList] = useState([]);
  const [token, setToken] =  useState(getCurrentToken() || '')
  const [user, setUser] = useState(getCurrentUser())  
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

  const getInitialCart = async () => {
    try {
            const getCart = await getCartByUser(token)               
                if (getCart.data.id) {
                    setShoppingCart(getCart.data)
                    setOrderId(getCart.data.id)
                }  else if (!getCart.data.id && user && user.id) {
                    const {id} = user
                    const makeNewOrder = await createInitialOrderId('created', id)
                    setOrderId(makeNewOrder.id)
                }
    }   catch(error) {
        console.error(error)
    }
  }


useEffect(() => {
    getInitialCart()
    .then(cart => {
            })
            .catch(error => {
                console.error(error)
            });
    }, []);


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
      <NavBar user={user} setUser={setUser} token={token} setToken={setToken} setShoppingCart={setShoppingCart} setOrderId={setOrderId} setOldGuestCart={setOldGuestCart}/>
        <Switch>
          <Route path="/Login">
            <Login setUser={setUser} token={token} setToken={setToken} setOrderId={setOrderId}/>
          </Route>
          <Route path="/register">
              <Register user={user} setUser={setUser} setToken={setToken} setOrderId={setOrderId} orderId={orderId}/>
          </Route>
          {user && token && 
            <Route path="/account">
              <Account user={user} />
            </Route>
          }
          <Route path="/product/:productId">
              <Product productList={productList} />
          </Route>
          <Route exact path="/products">
              <Products productList={productList} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} user={user} orderId={orderId} setOrderId={setOrderId}/>
          </Route>
          <Route path="/manage-products">
              <ManageProducts productList={productList} setProductList={setProductList} user={user} token={token}/>
          </Route>
          <Route exact path="/cart">
              <Cart user={user} token={token} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} orderId={orderId} setOrderId={setOrderId} oldGuestCart={oldGuestCart}/>
          </Route>
          <Route path="/guestcart">
              <GuestCart user={user} token={token} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} orderId={orderId} setOrderId={setOrderId}  oldGuestCart={oldGuestCart} setOldGuestCart={setOldGuestCart}/>
          </Route>            
          <Route exact path="/orders">
            <Orders user={user} />
          </Route>
          <Route exact path="/products/:productId/orders">
            <OrdersByProduct user={user} />
          </Route>
          <Route exact path="/orders/:orderId">
            <SingleOrder user={user} />
          </Route>
          <Route exact path="/users">
            <Users user={user} />
          </Route>
          <Route exact path="/users/:userId">
            <SingleUser user={user} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;