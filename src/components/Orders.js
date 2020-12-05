import React, {useState, useEffect }from 'react';
import { NavLink } from 'react-router-dom';
import {getAllOrders} from '../api'

const Orders = (props) => {
    const {user} = props;
    const [orders, setOrders] = useState([]);
    
    const fetchAllOrders = async () =>{
        try {
            const orders = await getAllOrders();
            setOrders(orders);
        } catch (error) {
            console.error(error);
        }
    }  
      
    useEffect(() => {
    fetchAllOrders();
    }, [])
    
    console.log(orders)
    return (<>
        {user && user.isAdmin &&
        <div className="orders-div">
            <h1>All Orders</h1>
            {orders.map(({id, status, userId, datePlaced}) => {
                return(
                <div key={id}>
                    <p>Order Number:{id}</p>
                    <p>User ID:{userId}</p>
                    <NavLink to={"/orders/" + id} activeClassName="current">Details</NavLink>
                </div>
            )})}
        </div>
    }
        

    </>)
}

export default Orders;