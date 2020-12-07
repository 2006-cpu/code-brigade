import React, {useState, useEffect }from 'react';
import {getOrdersByProductId, getProduct} from '../api'
import { NavLink, useParams } from 'react-router-dom';

const OrdersByProduct = (props) => {
    const {user} = props;
    const [orders, setOrders] = useState([]);
    const [product, setProduct] = useState({});
    const {productId} = useParams();
    
    
    const fetchOrdersByProduct = async () => {
        try {
            const orders = await getOrdersByProductId(productId);
            setOrders(orders);
        } catch (error) {
            console.error(error);
        }
    }  

    const setProductState = async () => {
        try {
            const response = await getProduct(productId);
            setProduct(response);
            console.log("THEPRODUCT:", product);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect (() => {
        setProductState();
    }, [orders])
      
    useEffect(() => {
        fetchOrdersByProduct();
    }, [])
    
    console.log(orders)
    return (<div>
        {user &&
        <div className="orders-div">
            <h1 style={{marginTop: "2em"}}>Orders With {product.name}</h1>

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

export default OrdersByProduct;