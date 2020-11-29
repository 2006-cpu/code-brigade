import React, { useEffect } from 'react';
import { getCartByUser } from '../api/index.js'

const Cart = (props) => {

    const {shoppingCart, setShoppingCart} = props
    const {user, token} = props

    const updateQuantity = (quantity, productIndex) => {
        shoppingCart.productList[productIndex].quantity = quantity
        console.log('shoppingCart: ', shoppingCart)
    }

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
                    maxWidth: "500px", padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}>
                    Order ID: {shoppingCart.id}</h3>  

                    {
                        shoppingCart.productList? 
                        <>
                        <section>
                        <h3>Items in your Cart</h3>
                        {   shoppingCart.productList.map((product, productIndex) =>
                            <div>
                            <div key={product.id} style={{border: "1px solid gray",
                            maxWidth: "500px", height: "400px", padding: "20px", topMargin: "10px"}}>
                                <p>{product.name} {product.description}</p>
                                <p>Product Id:{product.id}</p>
                                <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                <p>Category: {product.category}</p>
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                <p>Price: ${product.price}</p>
                            </div>
                            <select onChange={event => updateQuantity(event.target.value, productIndex)}>

                            {[1,2,3,4,5].map(quantity => (
                             <option value={quantity} key={quantity}>Quantity{quantity}</option>   
                            ) 
                            
                            )}
                            </select>
                            </div>
                        )
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