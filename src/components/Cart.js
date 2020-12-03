import React, { useEffect, useState } from 'react';
import TakeMoney from './TakeMoney.js';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import { getCartByUser, deleteOrderProduct, cancelledOrder, completedOrder, getStripe } from '../api/index.js'

const Cart = (props) => {
    const history = useHistory();
    const [update, setUpdate] = useState(false)
    const {shoppingCart, setShoppingCart} = props
    const {user, token, setOrderId } = props

    const handleCancelOrder = async (id) => {
        try {
            const result = await cancelledOrder(id, token) 
            console.log('resultcancellation', result)
            update ? setUpdate(false) : setUpdate(true);
            history.push("/products");
            swal({
                title: "Success!",
                text: "Your Order was cancelled!",
                icon: "success",
              });
        } catch(error) {
            console.error(error)
        }
    };

            const handleCompleteOrder = async (id) => {
        try {
            console.log('button test');
            const result = await completedOrder(id, token) 
            console.log('resultcompletion', result)
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
  

    useEffect(() => {
        getCartByUser(token)
            .then(cart => {
                setShoppingCart(cart.data)
            })
            .catch(error => {
                console.error(error)
            });
    }, [update]);

    const handleRemove = (e) => {
        e.preventDefault();
        deleteOrderProduct(e.target.id, token);
        update ? setUpdate(false) : setUpdate(true);
      }

    const totalSales = () => {
        let total = 0;
        shoppingCart.productList.forEach(product => {
            total += product.cartPrice * product.quantity      
        })
        return total
    };

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
                <div style={{border: "1px solid black", borderRadius: "5px",
                     padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}>
                    Order ID: {shoppingCart.id}</h3>  

                    {
                        shoppingCart.productList? 
                        <>
                        <section>
                        <h3>Items in your Cart</h3>
                        {   shoppingCart.productList.map((product) =>
                            <div key={product.id} style={{border: "1px solid gray", padding: "20px", topMargin: "10px"}}>
                                <p>{product.name} {product.description}</p>
                                <p>Product Id:{product.id}</p>
                                <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                <p>Category: {product.category}</p>
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                <p>Price: ${product.price}</p>                    
                                <button id={product.orderProductId} type="submit" onClick={handleRemove}>Remove From Cart</button>
                            </div>)
                        }
                        <button type="submit" onClick={() => handleCancelOrder(shoppingCart.id)}>Cancel Order</button>
                        {/* <button type="submit" onClick={() => handleCompleteOrder(shoppingCart.id)}>Complete Order</button> */}
                        </section>
                        </>
                        : ''
                    }
                    { shoppingCart && shoppingCart.productList ?
                        <div className="total" style={{textAlign: "center", fontSize: "20px", fontWeight: "bolder"}}>Cart Total ${ totalSales() }</div>
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
            // token={this.onToken} // submit callback
            //   opened={this.onOpened} // called when the checkout popin is opened (no IE6/7)
            //   closed={this.onClosed} // called when the checkout popin is closed (no IE6/7)
            // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
            // you are using multiple stripe keys
            reconfigureOnUpdate={false}
            // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`
            // useful if you're using React-Tap-Event-Plugin
            triggerEvent="onClick"
            >
            <button type="button" className="btn btn-primary" onClick={(e) => {
            e.preventDefault()
            handleCompleteOrder(shoppingCart.id)
            }}>Complete Order
            </button>
            </TakeMoney>   
        </div>
    )
};

export default Cart;