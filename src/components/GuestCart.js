import React, {useState, useEffect} from 'react';
import { getOrderById, editCartItem } from '../api/index.js';
import { storeCurrentCart } from '../auth';
import theTotal from './Utility.js';
import { useHistory } from "react-router-dom";
import Modal from "react-modal";

const GuestCart = (props) => {
    const {orderId} = props 
    const [guestCart, setGuestCart] = useState([])
    const [editOrderProductId, setEditOrderProductId] = useState(0)
    const [editQuantity, setEditQuantity] = useState(0)
    const [editPrice, setEditPrice] = useState(0)
    const [editFormId, setEditFormId] = useState(0)
    const [quantityForm, setQuantityForm] = useState(false)
    const [update, setUpdate] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    let history = useHistory()
  
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
    };

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

    function toggleModal() {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <h1 style={{marginTop: "2em"}}>Guest Shopping Cart</h1>
             { guestCart ? 
                <div style={{border: "1px solid black", borderRadius: "5px",
                     padding: "10px", topMargin: "10px"}}>
                    <h3 style={{textAlign: "center", fontWeight: "bold"}}>
                    Order ID: {guestCart.id}</h3>  

                    {
                        guestCart.productList? 
                        <>
                        <section>
                        <h3>Items in your Cart</h3>
                        {   guestCart.productList.map((product) =>
                            <div key={product.id} className="cartInfoContainer">
                            
                            <div className="infoContainer">
                                
                                <div className="imageContainer">
                                <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
                                </div> 
                                <div className="cartDetails">
                                            <div className="productName">
                                            <p> {product.name} {product.description}</p>
                                            </div>
                                            <div className="productId">
                                            <p>Product Id: {product.id}</p>
                                            </div>
                                            <div className="productCategory">
                                            <p>Category: {product.category}</p>    
                                            </div>
                                </div>
                            </div>    
                                <p className="priceQuantity"><span>Price: ${product.price}</span> <span>Quantity: {product.quantity}</span></p>
                
                                <button id={product.id} className="editCartQuantity" 
                                onClick={(event) => {
                                    handleEditQuantity(event)
                                    setEditQuantity(product.quantity)
                                }}>Edit Quantity</button>

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
                                    className="editButton">Update Cart</button>
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

            <div className="divModal">
                <button className="addProductButton" onClick={toggleModal}>Check Out</button>

                <Modal 
                        contentLabel="My dialog"
                        className="modalGuestCheckOut"
                        overlayClassName="overlayGuestCheckOut"
                        closeTimeoutMS={500}
                        ariaHideApp={false}
                        isOpen={isOpen}
                        onRequestClose={toggleModal}
                >
                    <h1>Welcome to Masks Co.</h1>
                    <p>Please create an account to complete your order</p>
                    <div className="alignButtons">
                    <button className="addProductButton" onClick={event =>  history.push('/register')}>Go</button>
                    </div>
                    <div className="guestCardButton">
                    <button className="closeModal" onClick={toggleModal}>Close</button> 
                    </div>
                </Modal>
            </div>

              </div>  
                  )
              };
        
    

export default GuestCart;
