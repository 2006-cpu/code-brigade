import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './index.css'

const NavBar = (props) => { 
    const {user, setUser, token, setToken, setShoppingCart, setOrderId} = props;

    const logout = () => {    
        if (token) {
            setToken('');
            setUser('');
            setShoppingCart([])
            setOrderId(0)
        } else {
           return 
        }
    }

    useEffect(() => {
        if(token){
            setToken(token) ;
        } 

        if(user){
            setUser(user) ;
        } 
    }, []);

    return (
        <div>
            {token ? <>
                <NavLink to={"/account"} activeClassName="current">My Account</NavLink>
                <NavLink to={"/products"} activeClassName="current">Products</NavLink>
                <NavLink to="/cart">View Cart</NavLink>
                <button style={{padding: "7px"}}onClick={logout}>Logout</button> 
                </>
            : 
            <>
                <NavLink to={"/products"} activeClassName="current">Products</NavLink>
                <NavLink to={"/register"} activeClassName="current">Register</NavLink>
                <NavLink to={"/login"} activeClassName="current">Login</NavLink> 
                <NavLink to="/guestcart">View Guest Cart</NavLink>
            </>
            }
            <>
            {user && user.isAdmin && <NavLink to="/orders">View Orders</NavLink>}
            </>
        </div>
    )
};

export default NavBar;
