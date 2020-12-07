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
    
    return (<div>
        {user && user.isAdmin &&
        <div className="orders-div">
            <h1>All Orders</h1>

                <section>
                    {orders.map(({id, status, userId, datePlaced}) => {
                    return (
                    <div key={id} className="ordersCard">
                        
                        <div className="orderNumber">
                        <p>Order Number:{id}</p>    
                        </div>
                        <div className="userId">
                        <p>User ID:{userId}</p>    
                        </div>
                        <NavLink to={"/orders/" + id} activeClassName="current">Details</NavLink>
                        
                    </div>
                )})}
                </section>

        </div>
    }
        

    </div>)
}

export default Orders;