import React, {useState} from 'react';
import axios from 'axios';
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
    const [ persistentModal, setPersistentModal ] = useState(false)

    const newOrder = async ({status}) => {
        try {
            const { data } = await axios.post(`${BASE_URL}api/orders`, {status});
            return data;
          } catch (error) {
          }
    };

    const buttonHandler = async (event) => {
        try {
            event.preventDefault();
            setShoppingCart('')
            const createGuestCart = await newOrder({status})
            setOrderId(createGuestCart.id)
            setShoppingCart(createGuestCart)
            setModal(false)
            setPersistentModal(false)
        } catch (error) {
            console.error(error)
        }
    };


    const createProductOrder = async ({orderId, productId, price, quantity}) => {
        try {
            const response = await axios.post(`${ BASE_URL }api/orders/${orderId}/products`, {orderId, productId, price, quantity})

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

            if (result.data.message == `column "undefined" does not exist`) {
                setPersistentModal(true)
                setErrorMessage ("Please log in or click on SHOP AS GUEST")
            } else if (result.data.message) {
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
                <p style={{fontWeight: "bolder", fontSize: "16"}}>Price: ${product.price}</p>
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
            <div className="guestPrompt" style={{display: modal? 'block' : 'none'}}>
                <form onSubmit={ buttonHandler }> 
                <h3 style={{color: "white", textAlign: "center"}}>Welcome to Masks Co.</h3>
                <p style={{color: "white", textAlign: "center"}}>Please log in to see your cart. Do you have an account?</p>
                <p className="buttons"><button>SHOP AS GUEST</button><button onClick={event =>  window.location.href='/login'}>LOG IN</button></p>
                </form>
            </div>
             : 
             ''
            }

            { 
            <div className="noOrderIdAlert" style={{display: persistentModal? 'block' : 'none'}}>
                <form onSubmit={ buttonHandler }>
                <h3>You are not logged in yet.</h3>
                <p>Continue as Guest Shopper?</p>
                <p className="buttons"><button>OK</button><button onClick={event =>  window.location.href='/login'}>LOG IN</button></p>
                </form>
            </div>
            }
        </>
    );
}

export default Products;