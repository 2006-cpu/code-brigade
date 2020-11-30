import React, { useEffect, useState } from 'react';
import { getCartByUser, deleteOrderProduct, editOrder, editCartItem } from '../api/index.js'
import Axios from 'axios';

const Cart = (props) => {
    const [update, setUpdate] = useState(false)
    const {shoppingCart, setShoppingCart} = props
    const {user, token, setOrderId } = props
    const [ price, setPrice ] = useState('')
    const [ quantity, setQuantity ] = useState('')
    const [ orderProductId, setOrderProductId ] = useState('')
    // const [token, setToken] = useState()


    // const updateQuantity = (quantity, productIndex) => {
    //     shoppingCart.productList[productIndex].quantity = quantity
    //     const currentProduct = shoppingCart.productList[productIndex]
    //     console.log('shoppingCart: ', shoppingCart)
    //     const finalPrice = quantity * currentProduct.price
    //     setShoppingCart(shoppingCart)
    //     editCartItem(currentProduct.orderProductId, finalPrice, quantity)
    // }

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

      const handleEdit = (e) => {
          e.preventDefault();
          editCartItem(orderProductId, price, quantity, token)
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
                    maxWidth: "500px", padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}>
                    Order ID: {shoppingCart.id}</h3>  

                    {
                        shoppingCart.productList? 
                        <>
                        <section>
                        <h3>Items in your Cart</h3>
                        {   shoppingCart.productList.map((product, productIndex) =>
                            <div key={productIndex}>
                            <div key={product.id} style={{border: "1px solid gray",
                            maxWidth: "500px", height: "400px", padding: "20px", topMargin: "10px"}}>
                                <p>{product.name} {product.description}</p>
                                <p>Product Id:{product.id}</p>
                                <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                <p>Category: {product.category}</p>
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                <p>Price: ${product.price}</p>
                            </div>
                          <select onChange={(e) => setQuantity(e.target.value)}>

                            {[1,2,3,4,5].map(quantity => (
                             <option value={quantity} key={quantity}>Quantity{quantity}</option>   
                            ) 
                            
                            )}
                            </select>
                        
                                <button id={product.orderProductId} type="submit" onClick={handleRemove}>Remove From Cart</button>
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