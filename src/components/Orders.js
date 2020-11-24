import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../api/index.js';
import { NavLink } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([])
    const fetchAllOrders = () => {
      getAllOrders()
      .then(orders => {
          setOrders(orders);
      })
      .catch(error => {
          console.error(error);
      });
    }
    
    useEffect(() => {
      fetchAllOrders()
    }, [])

    return (
        <div className="orders-div">
            <h1>All Orders</h1>
            {orders.map(({id, status, userId, datePlaced}) => {
                return <>
                <div key={datePlaced} id={id}>
                    <p>Order Number:{id}</p>
                    <p>User ID:{userId}</p>
                    <NavLink to={"/orders/" + id} activeClassName="current">Details</NavLink>
                </div>
            </>})}
        </div>

    )
}

export default Orders;