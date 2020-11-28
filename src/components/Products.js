import React, {useState, useEffect} from 'react';
import axios from 'axios';
//new Nov 28
import { createInitialOrderId } from '../api/index.js'
import GuestCart from './GuestCart'
//end of new Nov 28
const BASE_URL = '/'

const Products = (props) => {
    const {productList, shoppingCart, setShoppingCart, orderId, setOrderId} = props
    const [ price, setPrice ] = useState(1)
    const [ quantity, setQuantity ] = useState(1)
    const [ productId, setProductId ] = useState(1)
    const [ error, setError ] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [ status, setStatus ] = useState('created')
    const [ modal, setModal ] = useState(true)
    const [ guestCartChanged, setGuestCartChanged ] = useState(false)

    console.log("What is  shopping cart inside of Products.js", shoppingCart)
    console.log("what is cart id", shoppingCart.id )
    console.log("What is the productList", shoppingCart.productList)
    //new
    console.log("What is CURRENT ORDER ID", orderId, "PRODUCT ID:", productId, "PRICE:", price, "QUANTITY:", quantity )
    

    //new
    const newOrder = async ({status}) => {
        try {
            const { data } = await axios.post(`${BASE_URL}api/orders`, {status});
            console.log("What is NEW Guest Order Id", data)
            return data;
          } catch (error) {
          }
    };
    //new

    const buttonHandler = async (event) => {
        try {
            event.preventDefault();
            setShoppingCart('')
            const createGuestCart = await newOrder({status})
            console.log("What is the CREATE GUEST CART", createGuestCart)
            setOrderId(createGuestCart.id)
            setShoppingCart(createGuestCart)
            setModal(false)
        } catch (error) {
            console.error(error)
        }
    }


    const createProductOrder = async ({orderId, productId, price, quantity}) => {
        try {
            const response = await axios.post(`${ BASE_URL }api/orders/${orderId}/products`, {orderId, productId, price, quantity})
            console.log("response from :orderId route", response)
            return response;
        } catch (error) {
            console.error(error);
        }
    };
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
           
           const result = await createProductOrder({orderId, productId, price, quantity})
           console.log("What is the response of callback", result)

            console.log("What is RESULT DATA", result.data)
            console.log("What is ERROR MESSAGE", result.data.message)
            console.log("What is RESULT ERROR", { error: result.data.error})
            setGuestCartChanged(true)
           

           if (result.data.message) {
                setError(true)
                setErrorMessage(result.data.message)
                }
        } catch(error) {
            console.error(error)
        }
    };

    console.log("What is the current error message?", errorMessage)

    return (
        <>
            {productList && productList.map((product) => <div key={product.id}>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <div><img src={product.imageurl} alt="Mask" width="250" height="250"></img></div>
                <div>In Stock?
                    { product.inStock ? <p>Yes</p> : <p>No</p> 
                }</div>
                <p>Category: {product.category}</p>  


            <form onSubmit={ handleSubmit }>
                <button onClick={()=> {
              
                setProductId(product.id)
                setPrice(product.price)
          
                console.log("INSIDE HANDLE SUBMIT What is CURRENT ORDER ID", orderId, "PRODUCT ID:", productId, "PRICE:", price, "QUANTITY:", quantity )

                }} style={{color: "blue"}}>Add to Cart</button>
               
            </form>
            </div>
            )}
             { errorMessage ? <div className="errorMessage" style={{backgroundColor: "yellow"}}
                   style={{display: error ? 'block' : 'none', textAlign: "center"}}
                    >{errorMessage}
                    <span className="close" style={{color: "red"}} onClick={() => setError(false)}> X CLOSE</span> 
                    </div> : '' }

            { !orderId ?
            <div className="guestPrompt">
                <form onSubmit={ buttonHandler } style={{display: modal? 'block' : 'none'}}> 
                <span className="close" style={{color: "red"}} onClick={() => setModal(false)}> X CLOSE</span> 
                <h3>GUEST Prompt</h3>
                <p>Do you have an account?</p>
                <button>NO</button>
                </form>
            </div>
             : 
             ''
            }
        
            <GuestCart orderId={orderId} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} guestCartChanged={guestCartChanged}/>
        </>
    );
}

export default Products;