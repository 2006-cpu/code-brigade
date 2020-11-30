import React, { useEffect, useState } from 'react';
import { getCartByUser, deleteOrderProduct, editOrder, editCartItem } from '../api/index.js'
import CartItem from './CartItem';

const Cart = ({shoppingCart, setShoppingCart, user, token, setOrderId}) => {
    const [update, setUpdate] = useState(false)

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