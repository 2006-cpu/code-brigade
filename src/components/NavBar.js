import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = (props) => { 
    const {token, setToken} = props;

    const logout = () => {    
        if (token) {
            setToken('');
        } else {
           return 
        }
    }

    useEffect(() => {
        if(token){
            setToken(token) ;
        } 
    }, []);

    return (
        <div>
            {token ? <>
                <NavLink to={"/account"} activeClassName="current">My Account</NavLink>
                <NavLink to={"/products"} activeClassName="current">Products</NavLink>
                <button onClick={logout}>Logout</button> 
                </>
            : 
            <>
                <NavLink to={"/products"} activeClassName="current">Products</NavLink>
                <NavLink to={"/register"} activeClassName="current">Register</NavLink>
                <NavLink to={"/login"} activeClassName="current">Login</NavLink> 
            </>
            }
        </div>
    )
};

export default NavBar;
