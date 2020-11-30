import React, { useEffect, useState } from 'react';
import { getCartByUser, deleteOrderProduct, cancelledOrder, completedOrder } from '../api/index.js'
// import { checkout } from '../../routes/users.js';

const Checkout = (props) => {
    const [update, setUpdate] = useState(false)
    const {shoppingCart, setShoppingCart} = props
    const {user, token, setOrderId } = props

    const handleCompleteOrder = async (id) => {
        try {
            // event.preventDefault();
            const result = await completedOrder(id) 
            console.log('id', id)
            // console.log('token', token);
            console.log('resultCompletion', result);
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
                <h2>Checkout</h2>
                : 
                <h2>Please log in to view your cart</h2>
            }
            {
                shoppingCart.id ? 
                <div style={{border: "1px solid black", borderRadius: "5px",
                     padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}>
                    Order ID: {shoppingCart.id}</h3>  
                    <div>
                    <h1>{user.username}'s Summary Account</h1>
                    { user.imageurl ?
                    <div><img src={user.imageurl} alt={user.username} width="250" height="250"></img></div>
                    : <div><img src='https://picsum.photos/200' alt={user.username} width="250" height="250"></img></div>
                    }
                    <p>{user.firstName}</p>
                    <p>{user.lastName}</p>
                    <p>{user.email}</p>
                    </div>    

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

export default Checkout;