import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
//new below
import { clearCurrentUser, clearCurrentToken} from '../auth';
import './index.css'

const NavBar = (props) => { 
    const {user, setUser, token, setToken, setShoppingCart, setOrderId, orderId} = props;

    const logout = () => {    
        if (token) {
            setToken('');
            setUser('');
            setShoppingCart([])
            setOrderId(0)

            //new both
            clearCurrentUser()
            clearCurrentToken()
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
           {/* testing view cart    remove from here later  */}
                <NavLink to="/cart">View Cart</NavLink>
            </>
            }
            <>
            {user && user.isAdmin && <NavLink to="/orders">View Orders</NavLink>}
            </>
        </div>
    )
};

export default NavBar;
