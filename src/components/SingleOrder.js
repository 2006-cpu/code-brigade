import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
// import { getAllOrders } from '../api';
import { getAllOrders } from '../api/index.js';


const SingleOrder = () => {
    const {orderId} = useParams();
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

    const singleOrder = orders.find(singleElm => Number(orderId) === singleElm.id);
    console.log("the order", singleOrder)

    console.log(orders)

    return (
      <div>
      <h1>Orders</h1>
      {
      singleOrder && 
      <>
          <p>{singleOrder.id}</p>
          <p>{singleOrder.status}</p>
          <p>{singleOrder.datePlaced}</p>
      </>
      }   
  </div>
);
}


export default SingleOrder;

// {order[0].productList.map(() => {} )}