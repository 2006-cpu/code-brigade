import React, { useEffect, useState } from 'react';
import TakeMoney from './TakeMoney.js';
import theTotal from './Utility.js'
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import { getCartByUser, deleteOrderProduct, cancelledOrder, completedOrder, getStripe, editCartItem, createInitialOrderId } from '../api/index.js'
import { get } from 'react-hook-form';

const Cart = (props) => {
    const history = useHistory();
    const [update, setUpdate] = useState(false)

    const [editOrderProductId, setEditOrderProductId] = useState(1)
    const [editQuantity, setEditQuantity] = useState(0)
    const [editPrice, setEditPrice] = useState(2)

    const {shoppingCart, setShoppingCart} = props
    const {user, token, setOrderId, orderId } = props

    const [ editFormId, setEditFormId ] = useState(1)
    const [ quantityForm, setQuantityForm ] = useState(false)


    const handleCancelOrder = async (id) => {
        try {
            const result = await cancelledOrder(id, token) 
            console.log('resultcancellation', result)
            update ? setUpdate(false) : setUpdate(true);
            history.push("/products");
            swal({
                title: "Success!",
                text: "Your Order was cancelled!",
                icon: "success",
              });
        } catch(error) {
            console.error(error)
        }
    };

            const handleCompleteOrder = async (id) => {
        try {
            const result = await completedOrder(id, token) 
            update ? setUpdate(false) : setUpdate(true);
        } catch(error) {
            console.error(error)
        }
    };


    const getInitialCart = async () => {
        try {
                const getCart = await getCartByUser(token)               
                    if (getCart.data.id) {
                        setShoppingCart(getCart.data)
                        setOrderId(getCart.data.id)
                    }  else if (!getCart.data.id && user && user.id) {
                        const {id} = user
                        const makeNewOrder = await createInitialOrderId('created', id)
                        setOrderId(makeNewOrder.id)
                    }
        }   catch(error) {
            console.error(error)
        }
    };


    useEffect(() => {
        getInitialCart()
        .then(cart => {
                })
                .catch(error => {
                    console.error(error)
                });
    }, [token, update]);
  

    const fetchCart = async () => {
      try {
        const cart = await getCartByUser(token);
        setShoppingCart(cart.data);
        setOrderId(cart.data.id);
      } catch (error) {

      }
    }

    useEffect(() => {
        fetchCart();
    }, [update]);

    const handleRemove = (e) => {
        e.preventDefault();
        deleteOrderProduct(e.target.id, token);
        update ? setUpdate(false) : setUpdate(true);
      }


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
    }

    return (
        <div>
            
            {
                user?  
                <h2>{user.username}'s Shopping Cart</h2>
                : 
                <h2>Your Shopping Cart</h2>
            }
            {
                shoppingCart.id ? 
                <div style={{border: "1px solid black", borderRadius: "5px",
                     padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", backgroundColor: "lightyellow"}}>
                    {shoppingCart.id? <p>Order ID: {shoppingCart.id}</p> : ''}</h3>  

                    {
                        shoppingCart.productList? 
                        <>
                        <section>
                        <h3>Items in your Cart</h3>
                        {   shoppingCart.productList.map((product) =>
                            <div key={product.id} style={{border: "1px solid gray", padding: "20px", topMargin: "10px"}}>
                                <p>{product.name} {product.description}</p>
                                <p>Product Id:{product.id}</p>
                                <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
                                <p>Category: {product.category}</p>
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                <p className="priceQuantity"><span>Price: ${product.price}</span> <span>Quantity: {product.quantity}</span></p>

                                <button id={product.id} className="editCartQuantity" 
                                onClick={handleEditQuantity}>Edit Quantity</button>

                            { quantityForm && editFormId == product.id &&
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

                                <button id={product.orderProductId} type="submit" onClick={handleRemove}>Remove From Cart</button>
                            </div>)
                        }
                        <button type="submit" onClick={() => handleCancelOrder(shoppingCart.id)}>Cancel Order</button>
                        {/* <button type="submit" onClick={() => handleCompleteOrder(shoppingCart.id)}>Complete Order</button> */}
                        </section>
                        </>
                        : ''
                    }
                    { shoppingCart && shoppingCart.productList ?
                        <div className="total" style={{textAlign: "center", fontSize: "20px", fontWeight: "bolder"}}>Cart Total ${ theTotal(shoppingCart.productList) }</div>
                        : ''
                    }
                </div>    
                :
                ''
            } 
            
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
            triggerEvent="onClick"
            >
            <button type="button" className="btn btn-primary" onClick={(e) => {
            e.preventDefault()
            handleCompleteOrder(shoppingCart.id)
            }}>Complete Order
            </button>
            </TakeMoney>   
        </div>
    )
};

export default Cart;