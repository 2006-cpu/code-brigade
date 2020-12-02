import React, {useState, useEffect} from 'react';
import { getOrderById, cancelledGuestOrder, getStripe } from '../api/index.js'
import { storeCurrentCart } from '../auth';
import theTotal from './Utility.js'
import TakeMoney from './TakeMoney.js'

const GuestCart = (props) => {
    const {orderId, oldGuestCart, setOldGuestCart} = props 
    const [ guestCart, setGuestCart ] = useState([])


    const getOrder = async () => {
        try {
            const guestCart = await getOrderById(orderId);
            setGuestCart(guestCart);
            storeCurrentCart(guestCart);
        } catch (error) {
            console.error(error); 
        }
        
    }

    useEffect(()=> {
        getOrder();
    }, []);
    
    // const totalSales = () => {
    //     let total = 0;
    //     guestCart.productList.forEach(product => {
    //         total += product.price * product.quantity 
    //     })
    //     return total

    //new
    const PreviousGuestCart = () => {
        return (
            <section>
            <h2>Your Previous Guest Cart History</h2>
            <p> 
             Please create an account to take advantage of our services. Thank you.</p>
            <p>Order Number: {oldGuestCart.id}</p>
            <h3>Items in your Previous Cart</h3>
            {   oldGuestCart.productList.map((product) =>
                <div key={product.id} style={{border: "1px solid gray",
                maxWidth: "500px", height: "400px", padding: "20px", topMargin: "10px"}}>
                    <p>{product.name} {product.description}</p>
                    <p>Product Id:{product.id}</p>
                    <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                    <p>Category: {product.category}</p>
                    <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                    <p className="priceQuantity"><span>Price: ${product.price}</span> <span>Quantity: {product.quantity}</span></p>
                </div>)
            }
            </section>
        )

    };
    //end of new

    return (
        <div>
            <h1>Guest Shopping Cart</h1>
             { guestCart ? 
                <div style={{border: "1px solid black", borderRadius: "5px",
                     padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}>
                    Order ID: {guestCart.id}</h3>  

                    {
                        guestCart.productList? 
                        <>
                        <section>
                        <h3>Items in your Cart</h3>
                        {   guestCart.productList.map((product) =>
                            <div key={product.id} style={{border: "1px solid gray", padding: "20px", topMargin: "10px"}}>
                                <p>{product.name} {product.description}</p>
                                <p>Product Id:{product.id}</p>
                                <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                <p>Category: {product.category}</p>
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                <p className="priceQuantity"><span>Price: ${product.price}</span> <span>Quantity: {product.quantity}</span></p>
                            </div>)
                        }
                        </section>
                 
                        <div className="total" style={{textAlign: "center", fontSize: "20px", fontWeight: "bolder"}}>Cart Total ${ theTotal(guestCart.productList) }</div>
                
                        </>
                        : ''
                    }
                </div>    
                :
                ''
                } 
                <div> { oldGuestCart && oldGuestCart.productList ? <PreviousGuestCart /> : ''}</div>            
                  
                <TakeMoney
                name="Three Comma Co." // the pop-in header title
                description="Big Data Stuff" // the pop-in header subtitle
                image="https://www.vidhub.co/assets/logos/vidhub-icon-2e5c629f64ced5598a56387d4e3d0c7c.png" // the pop-in header image (default none)
                ComponentClass="div"
                panelLabel="Give Money" // prepended to the amount in the bottom pay button
                amount={1000000} // cents
                currency="USD"
                stripeKey="..."
                locale="zh"
                email="info@vidhub.co"
                // Note: Enabling either address option will give the user the ability to
                // fill out both. Addresses are sent as a second parameter in the token callback.
                shippingAddress
                billingAddress={false}
                // Note: enabling both zipCode checks and billing or shipping address will
                // cause zipCheck to be pulled from billing address (set to shipping if none provided).
                zipCode={false}
                alipay // accept Alipay (default false)
                bitcoin // accept Bitcoins (default false)
                allowRememberMe // "Remember Me" option (default true)
              //   token={this.onToken} // submit callback
              //   opened={this.onOpened} // called when the checkout popin is opened (no IE6/7)
              //   closed={this.onClosed} // called when the checkout popin is closed (no IE6/7)
                // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
                // you are using multiple stripe keys
                reconfigureOnUpdate={false}
                // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`
                // useful if you're using React-Tap-Event-Plugin
                triggerEvent="onTouchTap"
                >
                <button className="btn btn-primary">
                  Use your own child component, which gets wrapped in whatever
                  component you pass into as "ComponentClass" (defaults to span)
                </button>
              </TakeMoney> 
              </div>  
                  )
              };
        
    

export default GuestCart;