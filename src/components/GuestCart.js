import React, {useState, useEffect} from 'react';
import { getOrderById } from '../api/index.js'


const GuestCart = (props) => {
    const {orderId, shoppingCart, setShoppingCart, guestCartChanged } = props
    console.log("What are the props for Guest Cart", props)
    const [ guestCart, setGuestCart] = useState([])

    useEffect(() => {
        getOrderById(orderId)
            .then(guestCart => {
                console.log("What is guest cart data", guestCart)
          
                setGuestCart(guestCart)
            })
            .catch(error => {
                console.error(error)
            });
    }, [guestCartChanged]);

  

    return (
        <div>
            <h1>Your Shopping Cart</h1>
            <p>Testing</p>
             { guestCart ? 
                <div style={{border: "1px solid black", borderRadius: "5px",
                    maxWidth: "500px", padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}>
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
        </div>
    )

} ;

export default GuestCart;