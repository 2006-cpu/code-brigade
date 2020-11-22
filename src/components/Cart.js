import React from 'react';

const Cart = (props) => {

    // const [ shoppingCart, setShoppingCart] = ([])
    const {user, token} = props

    console.log("What are Cart props", props)
    console.log("What is user in Cart", user)
    console.log("What is username from props", user.username)

    return (
        <div>
            {
            user.username && token ?  
            <h2>{user.username}'s Shopping Cart</h2>
            : 
            <h2>Your Shopping Cart</h2>
            }
        </div>
    )
};

export default Cart;