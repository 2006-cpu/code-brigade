import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {getOrderById, editOrder} from '../api'



const SingleOrder = (props) => {
    const [order, setOrder] = useState({});
    const [edit, setEdit ] = useState(false);
    const [userId, setUserId ] = useState(0);
    const [status, setStatus ] = useState('');
    const {orderId} = useParams();
    const {user} = props;
    const statusSelect = ["Select Status", "created", "completed", "cancelled"];

    const fetchOrder = async () => {
      try {
        const order = await getOrderById(orderId);
        setOrder(order);
      } catch (error) {
        console.error(error);
      }
    }
    
    useEffect(() => {
      fetchOrder();
    }, [edit])

    const handleForm = (e) => {
      e.preventDefault();
      setStatus(order.status);
      setUserId(order.userId);
      edit ? setEdit(false) : setEdit(true);
    }

    const handleEdit = (e) => {
      e.preventDefault();
      editOrder({ userId, status}, e.target.id);
      setUserId('');
      setStatus('');
      edit ? setEdit(false) : setEdit(true);
    }

    
    return (
      <div>
      <h1 style={{marginTop: "2em"}}>Orders</h1>
      {
      order && user.isAdmin &&
      <>
          <p>Order Number: {order.id}</p>
          <p>User ID: {order.userId}</p>
          <p>Order Status: {order.status}</p>
          <p>Date Placed: {order.datePlaced}</p>
          <button className="edit-order" onClick={handleForm}>Edit Order</button>
          <div>{edit &&
          <form>
            <h3>Edit Order</h3>
            <input type="text" placeholder={"New User ID"} value={userId} onChange={(e) => setUserId(e.target.value)}/>
            <select onChange={(e) => {
              setStatus(e.target.value)
             }}>{
              statusSelect.map(status => (
                  <option key={ status } value={ status }>
                  { status }
                  </option>
              ))
            }</select>
            <button id={order.id} type="submit" onClick={handleEdit}>Update</button>
          </form>}</div>
      </>
      }   
  </div>
);
}


export default SingleOrder;
