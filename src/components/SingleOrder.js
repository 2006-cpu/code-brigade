import React from 'react';
import { useParams } from 'react-router-dom';


const SingleOrder = (props) => {
    const {orderId} = useParams();
    const {user, orders} = props;


    const singleOrder = orders.find(singleElm => Number(orderId) === singleElm.id);

    return (
      <div>
      <h1>Orders</h1>
      {
      singleOrder && user.isAdmin &&
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
