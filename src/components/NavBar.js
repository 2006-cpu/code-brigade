import React from 'react';

const NavBar = () => {

    return (
        <div>
            <ul id="nav">
                <li><a href="/register">Register</a></li>
                <li><a href="/product/:productId">Product</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </div>
    )
};

export default NavBar;