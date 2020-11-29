import React, {useState, useEffect} from 'react';
import { getOrderById } from '../api/index.js'
   //new below for localStorage
import { storeCurrentCart } from '../auth';



const GuestCart = (props) => {
    const {orderId, oldGuestCart, setOldGuestCart} = props 
    const [ guestCart, setGuestCart ] = useState([])
    
    useEffect(() => {
        getOrderById(orderId)
            .then(guestCart => {
                setGuestCart(guestCart)
                storeCurrentCart(guestCart)
            })
            .catch(error => {
                console.error(error)
            });
    }, []);

    return (
        <div>
            <h1>Guest Shopping Cart</h1>
             { guestCart ? 
                <div style={{border: "1px solid black", borderRadius: "5px",
                     padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}
                    >
                    Order ID: {guestCart.id}</h3>  

                    {
                        guestCart.productList? 
                        <>
                        <section>
                        <h3>Items in your Cart</h3>
                        {   guestCart.productList.map((product) =>
                            <div key={product.id} style={{border: "1px solid gray",
                            maxWidth: "500px", height: "400px", padding: "20px", topMargin: "10px"}}>
                                <p>{product.name} {product.description}</p>
                                <p>Product Id:{product.id}</p>
                                <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                <p>Category: {product.category}</p>
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                <p>Price: ${product.price}</p>
                            </div>)
                        }
                        </section>
                        </>
                        : ''
                    }

                </div>    
                :
                ''
                } 
                <div>
                    {
                        oldGuestCart && oldGuestCart.productList ?
                        <div className="oldGuestCart">
                            <h2>Your Previous Cart</h2>
                            <p>Please check out now or lose your previous guest order. You cannot change a previous guest cart. 
                             Please create an account to take advantage of updating and deleting an account cart. Thank you.</p>
                            <p>Order Number: {oldGuestCart.id}</p>
                            { 
                                oldGuestCart.productList ?
                                <>
                                <section>
                                <h3>Items in your Previous Cart</h3>
                                {   oldGuestCart.productList.map((product) =>
                                    <div key={product.id} style={{border: "1px solid gray",
                                    maxWidth: "500px", height: "400px", padding: "20px", topMargin: "10px"}}>
                                        <p>{product.name} {product.description}</p>
                                        <p>Product Id:{product.id}</p>
                                        <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                        <p>Category: {product.category}</p>
                                        <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                        <p>Price: ${product.price}</p>
                                    </div>)
                                }
                                </section>
                                </>
                                :
                                ''
                            }
                        </div>
                        : ''
                    }
                </div>
        </div>
    )

} ;

export default GuestCart;