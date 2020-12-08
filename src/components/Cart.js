import React, { useEffect, useState } from 'react';
import TakeMoney from './TakeMoney.js';
import theTotal from './Utility.js'
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import { getCartByUser, deleteOrderProduct, cancelledOrder, editCartItem, createInitialOrderId } from '../api/index.js'

const Cart = (props) => {
    const {shoppingCart, setShoppingCart, user, token, setOrderId, orderId} = props
    const history = useHistory();
    const [update, setUpdate] = useState(false)
    const [editOrderProductId, setEditOrderProductId] = useState(1)
    const [editQuantity, setEditQuantity] = useState(0)
    const [editPrice, setEditPrice] = useState(2)
    const [editFormId, setEditFormId] = useState(1)
    const [quantityForm, setQuantityForm] = useState(false)

    const handleCancelOrder = async (id) => {
        try {
            const result = await cancelledOrder(id, token) 
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
        <>
            
            {
                user?  
                <h1 style={{marginTop: "2em"}}>{user.username}'s Shopping Cart</h1>
                : 
                <h1 style={{marginTop: "2em"}}>Your Shopping Cart</h1>
            }
            {
                shoppingCart.id ? 
                <div key={shoppingCart.id} style={{border: "1px solid black", borderRadius: "5px",
                     padding: "10px", topMargin: "10px"}}>
            
                    <h3 style={{textAlign: "center"}}>
                    {shoppingCart.id? <p>Order ID: {shoppingCart.id}</p> : ''}</h3>  

                    {
                        shoppingCart.productList? 
                        
                        <section>
                        <h3>Items in your Cart</h3>
                        {   shoppingCart.productList.map((product) =>
                    
                                <div key={product.id} className="cartInfoContainer">
                                
                                        <div className="infoContainer">
                                            <div className="imageContainer">
                                            <img src={product.imageurl} alt="Mask" width="250" height="250"></img> 
                                            </div>
                                            <div className="cartDetails">
                                            <div className="productName">
                                            <p>{product.name} {product.description}</p>
                                            </div>
                                            <div className="productId">
                                            <p>Product Id:{product.id}</p>
                                            </div>
                                            <div className="orderProductId">
                                            <p>Order Product Id (for temporary testing):{product.orderProductId}</p>    
                                            </div>
                                            <div className="productCategory">
                                            <p>Category: {product.category}</p>    
                                            </div>
                                        </div>
                                            
                                    </div>
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
                                    <div className="removeFromCart">
                                    <button id={product.orderProductId} type="submit" onClick={handleRemove}>Remove From Cart</button>
                                    </div> 
                                 
                            </div>)
                        }
                        <button type="submit" onClick={() => handleCancelOrder(shoppingCart.id)}>Cancel Order</button>
                        </section>
                        
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
            <TakeMoney orderId={orderId} token={token}>
            <button type="button" className="btn btn-primary" onClick={(e) => {
            e.preventDefault()
            }}>Complete Order
            </button>
            </TakeMoney>   
        </>
    )
};

export default Cart;