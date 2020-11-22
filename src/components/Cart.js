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
                    Order ID: {shoppingCart.id}</h3>  
                </div>    
                :
                ''
            }     
        </div>
    )
};

export default Cart;