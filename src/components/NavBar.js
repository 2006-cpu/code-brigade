import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { clearCurrentUser, clearCurrentToken, clearCurrentCart } from '../auth';
import './index.css'

const NavBar = (props) => { 
    const {user, setUser, token, setToken, setShoppingCart, setOrderId, setOldGuestCart} = props;

    const logout = () => {    
        if (token) {
            setToken('');
            setUser('');
            setShoppingCart([])
            setOrderId(0)
            clearCurrentUser()
            clearCurrentToken()
            setOldGuestCart([])
            clearCurrentCart()
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
            <div className="topnav">
                <NavLink to={"/account"}>My Account</NavLink>
                <NavLink to={"/products"}>Products</NavLink>
                <NavLink to={"/cart"}>View Cart</NavLink>
                <div className="topnav-right">
                    <button onClick={logout}>Logout</button> 
                </div>
            </div>
                
            </>
            : 
            <>
                <div className="topnav">
                    <NavLink to={"/products"}>Products</NavLink>
                    <NavLink to={"/guestcart"}>View Guest Cart</NavLink>
                </div>
                <div className="topnav-right">
                    <NavLink to={"/register"}>Register</NavLink>
                    <NavLink to={"/login"}>Login</NavLink> 
                </div>
            </>
            }
            <div className="topnav">
            {user && user.isAdmin && <NavLink to="/orders">View Orders</NavLink>}
            {user && user.isAdmin && <NavLink to="/users">View Users</NavLink>}

            {user && user.isAdmin && <NavLink to="/manage-products">Manage Products</NavLink>}

            </div>
        </div>
        
    )
};

export default NavBar;
