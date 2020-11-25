import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {getOrderById} from '../api'



const SingleOrder = (props) => {
    const [order, setOrder] = useState({});
    const {orderId} = useParams();
    const {user} = props;

    const fetchOrder = () => {
      getOrderById(orderId)
      .then(order => {
          setOrder(order);
      })
      .catch(error => {
          console.error(error);
      });
    }
    
    useEffect(() => {
      fetchOrder()
    }, [])

    
    return (
      <div>
      <h1>Orders</h1>
      {
      order && user.isAdmin &&
      <>
          <p>{order.id}</p>
          <p>{order.status}</p>
          <p>{order.datePlaced}</p>
      </>
      }   
  </div>
);
}


export default SingleOrder;
