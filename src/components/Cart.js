import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import TakeMoney from './TakeMoney.js'
import { getCartByUser, deleteOrderProduct, cancelledOrder, editOrder, completedOrder, editCartItem, getStripe } from '../api/index.js'

const Cart = ({shoppingCart, setShoppingCart, user, token, setOrderId}) => {
    const [update, setUpdate] = useState(false)

    const handleCancelOrder = async (id) => {
        try {
            const result = await cancelledOrder(id, token) 
            console.log('resultcancellation', result)
            update ? setUpdate(false) : setUpdate(true);
        } catch(error) {
            console.error(error)
        }
    };

    useEffect(() => {
        getCartByUser(token)
            .then(cart => {
                setShoppingCart(cart.data)
                setOrderId(cart.data.id)
            })
            .catch(error => {
                console.error(error)
            });
    }, [token]);
  
    console.log("What is currently in the shopping cart", shoppingCart)

    useEffect(() => {
        if(update) {
            getCartByUser(token)
            .then(cart => {
                setShoppingCart(cart.data)
            })
            .catch(error => {
                console.error(error)
            });
            setUpdate(false)
        }
    }, [update]);

    const handleRemove = (e) => {
        e.preventDefault();
        deleteOrderProduct(e.target.id, token);
        setUpdate(true);
    }

    const handleEditCartItem = (orderProductId, price, quantity, token) => {
        editCartItem(orderProductId, price, quantity, token);
        setUpdate(true);
    }

    return (
        <div>
            {
                user.username && token ?
                    <h2>{user.username}'s Shopping Cart</h2>
                    :
                    <h2>Your Shopping Cart</h2>
            }
            {
                shoppingCart.id ?
                    <div style={{
                        border: "1px solid black", borderRadius: "5px",
                        maxWidth: "500px", padding: "10px", topMargin: "10px"
                    }}>
                        <h3 style={{ textAlign: "center", backgroundColor: "lightyellow" }}>
                            Order ID: {shoppingCart.id}</h3>

                        {
                            shoppingCart.productList ?
                                <>
                                    <section>
                                        <h3>Items in your Cart</h3>
                                        {shoppingCart.productList.map((product, productIndex) => (
                                            <CartItem product={product} productIndex={productIndex} token={token} handleRemove={handleRemove} handleEditCartItem={handleEditCartItem} />
                                        ))}
                                        <button type="submit" onClick={() => handleCancelOrder(shoppingCart.id)}>cancel Order</button>

                                    </section>
                                </>
                                : ''
                        }

                    </div>
                    :
                    ''
            }
                
            <TakeMoney
  name="Three Comma Co." // the pop-in header title
  description="Big Data Stuff" // the pop-in header subtitle
  image="https://www.vidhub.co/assets/logos/vidhub-icon-2e5c629f64ced5598a56387d4e3d0c7c.png" // the pop-in header image (default none)
  ComponentClass="div"
  panelLabel="Give Money" // prepended to the amount in the bottom pay button
  amount={1000000} // cents
  currency="USD"
  stripeKey="..."
  locale="zh"
  email="info@vidhub.co"
  // Note: Enabling either address option will give the user the ability to
  // fill out both. Addresses are sent as a second parameter in the token callback.
  shippingAddress
  billingAddress={false}
  // Note: enabling both zipCode checks and billing or shipping address will
  // cause zipCheck to be pulled from billing address (set to shipping if none provided).
  zipCode={false}
  alipay // accept Alipay (default false)
  bitcoin // accept Bitcoins (default false)
  allowRememberMe // "Remember Me" option (default true)
//   token={this.onToken} // submit callback
//   opened={this.onOpened} // called when the checkout popin is opened (no IE6/7)
//   closed={this.onClosed} // called when the checkout popin is closed (no IE6/7)
  // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
  // you are using multiple stripe keys
  reconfigureOnUpdate={false}
  // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`
  // useful if you're using React-Tap-Event-Plugin
  triggerEvent="onTouchTap"
  >
  <button className="btn btn-primary">
    Use your own child component, which gets wrapped in whatever
    component you pass into as "ComponentClass" (defaults to span)
  </button>
</TakeMoney>   
        </div>
    )
};

export default Cart;