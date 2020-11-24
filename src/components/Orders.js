import React from 'react';
import { NavLink } from 'react-router-dom';

const Orders = (props) => {
    const {user, orders} = props;
    
    console.log(orders)
    return (<>
        {user && user.isAdmin &&
        <div className="orders-div">
            <h1>All Orders</h1>
            {orders.map(({id, status, userId, datePlaced}) => {
                return <>
                <div key={id}>
                    <p>Order Number:{id}</p>
                    <p>User ID:{userId}</p>
                    <NavLink to={"/orders/" + id} activeClassName="current">Details</NavLink>
                </div>
            </>})}
        </div>
    }
        

    </>)
}

export default Orders;