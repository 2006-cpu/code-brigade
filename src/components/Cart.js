import React, { useState, useEffect } from 'react';
import { getCartByUser } from '../api/index.js'

const Cart = (props) => {
    const [ shoppingCart, setShoppingCart] = useState([]) 
    const {user, token} = props

    useEffect(() => {
        getCartByUser(token)
            .then(cart => {
                setShoppingCart(cart.data)
            })
            .catch(error => {
                console.error(error)
            });
    }, [token]);

    console.log("What is currently in the shopping cart", shoppingCart)

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
                    maxWidth: "500px", height: "400px", padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}>
                    Order ID: {shoppingCart.orderId}</h3>  

                    {
                        shoppingCart.productList? 
                        <>
                        <section>
                        <h3>Items in your Cart</h3>
                        {   shoppingCart.productList.map((product) =>
                            <div key={product.id} style={{border: '1 solid black'}}>
                                <p>{product.name} {product.description}</p>
                                <p>Product Id:{product.id}</p>
                                <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                <p>Category: {product.category}</p>
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                <p>Price: ${product.price}</p>
                            </div>)
                        }
                        </section>
                        </>
                        : ''
                    }

                </div>    
                :
                ''
            }     
        </div>
    )
};

export default Cart;