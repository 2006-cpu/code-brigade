import React, {useState} from 'react';
import axios from 'axios';
import GuestCart from './GuestCart'
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

    const newOrder = async ({status}) => {
        try {
            const { data } = await axios.post(`${BASE_URL}api/orders`, {status});
            console.log("What is NEW Guest Order Id", data)
            return data;
          } catch (error) {
          }
    };

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
            setErrorMessage('')
            const result = await createProductOrder({orderId, productId, price, quantity})
            setGuestCartChanged(true)

           if (result.data.message) {
                setError(true)
                setErrorMessage(result.data.message)
                }
        } catch(error) {
            console.error(error)
        }
    };

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
                }} style={{color: "rgb(12, 56, 47)"}}>Add to Cart</button>
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
                <h3 style={{color: "white", textAlign: "center"}}>Welcome to Masks Co.</h3>
                <p style={{color: "white", textAlign: "center"}}>Please log in to see your cart. Do you have an account?</p>
                <button style={{textAlign: "center"}}>NO</button>
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