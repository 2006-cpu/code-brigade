import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const BASE_URL = '/'

const Products = (props) => {
    const { productList, shoppingCart, setShoppingCart, orderId, setOrderId} = props
    const [ price, setPrice ] = useState(1)
    const [ quantity, setQuantity ] = useState(1)
    const [ productId, setProductId ] = useState(1)
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ status, setStatus ] = useState('created')
    const [ modal, setModal ] = useState(true)
    const [ persistentModal, setPersistentModal ] = useState(false)
    const [ addedToCart, setAddedToCart ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState('')
    const searchEl = useRef(null)
 

    useEffect(() => {
        const timer = setTimeout(() =>  setAddedToCart(false), 1000);
        return () => clearTimeout(timer);
    }, [addedToCart]);

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
            } else {
                setAddedToCart(true)
            }
            } catch(error) {
            console.error(error)
        }
    };

    const clearSearchTerm = (event) => {
        event.preventDefault();
        setSearchTerm('');
        searchEl.current.value = '';
    };

    return (
        <>  <div className="search-form" action="/search">
                <input className="search" type="text" name="search-term" placeholder="search" id="search-field" ref={searchEl} onChange={event =>{setSearchTerm(event.target.value)}}/>
                <button className="search-button" type="submit" onClick={ clearSearchTerm}>Clear</button>
            </div>
            <section className="cards">
            {productList && productList.filter((product) => {
                if (searchTerm == "") {
                    return product
                } else if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return product
                } else if (product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return product
                }
            }).map((product) => 
            
                <div key={product.id} className="productCard">
                    <>
                    <div><img src={product.imageurl} alt="Mask" width="250" height="250"></img></div>
                    <div className="productName">
                        <h2>{product.name}</h2>
                    </div>
                    <div className="descriptionName">
                    <p>{product.description}</p> 
                    </div>
                    <p style={{fontWeight: "bolder", fontSize: "16"}}>Price: ${product.price}</p>
                    <div>
                        { product.inStock ? <p>In Stock</p> : <p style={{color: "red"}}>Out of Stock</p> 
                    }</div>
                    <>
                    <p>Category: {product.category}</p>  
                    <div className="orderButtonWrapper" >
                        <form className="orderProductForm" onSubmit= {handleSubmit}>
                            <div className="orderButton">
                    { product.inStock ? 
                        <button onClick={(event)=> {
                            setProductId(product.id)
                            setPrice(product.price)
                            }} className="addProductButton"
                            >Add to Cart</button>
                        : <button className="addProductButtonDisabled" disabled>Add to Cart</button>
                    }
                            </div>
                        </form>
                    </div>
                    </>
                    </>
                </div>
            )}
            </section>
            
            { errorMessage ? <div className="errorMessage"
                style={{display: error ? 'block' : 'none', textAlign: "center"}}>{errorMessage}
                <span className="close" style={{color: "red"}} onClick={() => setError(false)}> X CLOSE</span> 
                </div> 
                : '' 
            }

            { !orderId ?
                <div className="guestPrompt" style={{display: modal? 'block' : 'none'}}>
                    <form onSubmit={ buttonHandler }> 
                    <h3 style={{color: "white", textAlign: "center"}}>Welcome to Masks Co.</h3>
                    <p style={{color: "white", textAlign: "center"}}>Please log in to see your cart. Do you have an account?</p>
                    <p className="buttons"><button>SHOP AS GUEST</button><button onClick={event =>  window.location.href='/login'}>LOG IN</button></p>
                    </form>
                </div>
                : ''
            }

            { 
                <div className="guestPrompt" style={{display: persistentModal? 'block' : 'none'}}>
                <form onSubmit={ buttonHandler }>
                <h3 style={{color: "white", textAlign: "center"}}>You are not logged in yet.</h3>
                <p style={{color: "white", textAlign: "center"}}>Continue as Guest Shopper?</p>
                <p className="buttons"><button>OK</button><button onClick={event =>  window.location.href='/login'}>LOG IN</button></p>
                </form>
                </div>
            }

            { addedToCart ? 
                <div className="added">
                <p>In Cart!</p>
                </div>
                : ''
            }

        </>
    );
}

export default Products;