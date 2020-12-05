import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
//new below
import { clearCurrentUser, clearCurrentToken, clearCurrentCart } from '../auth';
import './index.css'

const NavBar = (props) => { 
    const {user, setUser, token, setToken, setShoppingCart, setOrderId, orderId, setOldGuestCart} = props;

    const logout = () => {    
        if (token) {
            setToken('');
            setUser('');
            setShoppingCart([])
            setOrderId(0)

            //new both
            clearCurrentUser()
            clearCurrentToken()
            setOldGuestCart([])
        //maybe this will fix localStorage below  with clearCurrentCart
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
            <div class="topnav">
                <NavLink to={"/account"} activeClassName="current">My Account</NavLink>
                <NavLink to={"/products"} activeClassName="current">Products</NavLink>
                <NavLink to="/cart">View Cart</NavLink>
                <div class="topnav-right">
                    <button onClick={logout}>Logout</button> 
                </div>
            </div>
                
            </>
            : 
            <>
                <div class="topnav">
                    <NavLink to={"/products"} activeClassName="current">Products</NavLink>
                    <NavLink to="/guestcart">View Guest Cart</NavLink>
                </div>
                <div class="topnav-right">
                    <NavLink to={"/register"} activeClassName="current">Register</NavLink>
                    <NavLink to={"/login"} activeClassName="current">Login</NavLink> 
                </div>
                
                
                {/* testing view cart    remove from here later  */}
                {/* <NavLink to="/cart">View Cart</NavLink> */}
            </>
            }
            <div class="topnav">
            {user && user.isAdmin && <NavLink to="/orders">View Orders</NavLink>}
            {user && user.isAdmin && <NavLink to="/users">View Users</NavLink>}
            </div>
 
        </div>
        
    )
};

export default NavBar;
