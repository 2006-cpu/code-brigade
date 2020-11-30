import React, { useEffect, useState } from 'react';
import { getCartByUser, deleteOrderProduct, cancelledOrder, completedOrder } from '../api/index.js'

const Cart = (props) => {
    const [update, setUpdate] = useState(false)
    const {shoppingCart, setShoppingCart} = props
    const {user, token, setOrderId } = props

    const handleCompleteOrder = async (id) => {
        try {
            // event.preventDefault();
            const result = await completedOrder(id, token) 
            console.log('resultcancellation', result)
            // console.log("What is RESULT ERROR", result.error)
            // console.log("What is ERROR MESSAGE", result.data.message)
            // console.log("What is RESULT ERROR", { error: result.data.error})
        } catch(error) {
            console.error(error)
        }
    };

    const handleCancelOrder = async (id) => {
        try {
            // event.preventDefault();
            const result = await cancelledOrder(id, token) 
            console.log('resultcancellation', result)
            // console.log("What is RESULT ERROR", result.error)
            // console.log("What is ERROR MESSAGE", result.data.message)
            // console.log("What is RESULT ERROR", { error: result.data.error})
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
                            <div key={product.id} style={{border: "1px solid gray",
                            maxWidth: "500px", height: "400px", padding: "20px", topMargin: "10px"}}>
                                <p>{product.name} {product.description}</p>
                                <p>Product Id:{product.id}</p>
                                <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                <p>Category: {product.category}</p>
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                <p>Price: ${product.price}</p>
                                <button id={product.orderProductId} type="submit" onClick={handleRemove}>Remove From Cart</button>
                            </div>)
                        }
                        <button type="submit" onClick={() => handleCancelOrder(shoppingCart.id)}>cancel Order</button>
                        <button type="submit" onClick={() => handleCompleteOrder(shoppingCart.id)}>Complete Order</button>
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