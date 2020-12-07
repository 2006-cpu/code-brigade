import React, {useState, useEffect} from 'react';
import { getOrderById, cancelledGuestOrder, getStripe, editCartItem } from '../api/index.js'
import { storeCurrentCart } from '../auth';
import theTotal from './Utility.js'
import TakeMoney from './TakeMoney.js'

const GuestCart = (props) => {
    const {orderId, oldGuestCart} = props 
    const [guestCart, setGuestCart] = useState([])
    const [editOrderProductId, setEditOrderProductId] = useState(1)
    const [editQuantity, setEditQuantity] = useState(0)
    const [editPrice, setEditPrice] = useState(2)
    const [editFormId, setEditFormId] = useState(1)
    const [quantityForm, setQuantityForm] = useState(false)
    const [update, setUpdate] = useState(false)
  
    const getOrder = async () => {
        try {
            const theGuestCart = await getOrderById(orderId);
            if(theGuestCart) {
            setGuestCart(theGuestCart);
            storeCurrentCart(theGuestCart);
            }
        } catch (error) {
            console.error(error); 
        }
        
    }

    useEffect(()=> {
        getOrder();
    }, [update]);


    const handleEdit = async(event) => {
        event.preventDefault();
        setQuantityForm(true)
        setEditFormId(event.target.id)
        try {
            const newEdit = await editCartItem(editOrderProductId, editPrice, editQuantity)
                if (newEdit) {
                    setUpdate(true)
                    setQuantityForm(false)
                    setEditQuantity(0)
                } 
            } catch(error) {
            console.error(error)
        }
    };

    const handleEditQuantity = (event) => {
        event.preventDefault()
        setEditFormId(event.target.id)
        quantityForm ? setQuantityForm(false) : setQuantityForm(true)
    };
    

    const PreviousGuestCart = () => {
        return (
            <section>
            <h2>Your Previous Guest Cart History</h2>
            <p> 
             Please create an account to take advantage of our services. Thank you.</p>
            <p>Order Number: {oldGuestCart.id}</p>
            <h3>Items in your Previous Cart</h3>
            {  oldGuestCart && !oldGuestCart.error ?
               
                oldGuestCart.productList.map((product) => 
                <div key={product.id} style={{border: "1px solid gray",
                maxWidth: "500px", height: "400px", padding: "20px", topMargin: "10px"}}>
                    <p>{product.name} {product.description}</p>
                    <p>Product Id:{product.id}</p>
                    <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                    <p>Category: {product.category}</p>
                    <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                    <p className="priceQuantity"><span>Price: ${product.price}</span> <span>Quantity: {product.quantity}</span></p>
                </div>)
                
                : ''
            }
            </section>
        )

    };

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
                
                                <button id={product.id} className="editCartQuantity" 
                                onClick={handleEditQuantity}>Edit Quantity</button>

                                { quantityForm && Number(editFormId) === product.id &&
                                    <form className="editOrderProductQuantity" 
                                    onSubmit={handleEdit}> 
                                    <label>Quantity:</label>
                                    <input id={editFormId} type="number" min="0" value={ editQuantity} name="editQuantity"
                                    onChange={(event) => { 
                                        setEditQuantity(event.target.value) 
                                        setEditPrice(product.price)
                                        setEditOrderProductId(product.orderProductId)
                                    }}/>
                                    <button 
                                    id={editFormId}
                                    onClick={()=> {
                                    setUpdate(false)
                                    }} 
                                    className="editButton">Update Quantity</button>
                                    </form>
                                }
   
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

                { oldGuestCart && oldGuestCart.productList ? <PreviousGuestCart /> : ''}
             

            {/* need to update this for stripe for guest cart */}
                <TakeMoney orderId={orderId}>
                <button className="btn btn-primary">
                  Use your own child component, which gets wrapped in whatever
                  component you pass into as "ComponentClass" (defaults to span)
                </button>
              </TakeMoney> 
              </div>  
                  )
              };
        
    

export default GuestCart;