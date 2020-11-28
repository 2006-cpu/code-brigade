import React, {useState} from 'react';
import axios from 'axios';
const BASE_URL = '/'

const Products = (props) => {
    const {productList, shoppingCart, setShoppingCart} = props
    const [ price, setPrice ] = useState(1)
    const [ quantity, setQuantity ] = useState(1)
    const [ productId, setProductId ] = useState(1)
    const [ orderId,  setOrderId ] = useState(shoppingCart.id)
    const [ error, setError ] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    console.log("What is  shopping cart inside of Products.js", shoppingCart)
    console.log("what is cart id", shoppingCart.id )
    console.log("What is the productList", shoppingCart.productList)

    const finder = (id) => {
        const product = shoppingCart.productList.filter(singleProduct => id === singleProduct.id);
        console.log(product)
    }


    //NEW
    const createProductOrder = async ({orderId, productId, price, quantity}) => {
        try {
            const response = await axios.post(`${ BASE_URL }api/orders/${shoppingCart.id}/products`, {orderId, productId, price, quantity})
            console.log("response from :orderId route", response)
            return response;
        } catch (error) {
            console.error(error);
        }
    };
    //NEW
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
           const result = await createProductOrder({orderId, productId, price, quantity})
           console.log("What is the response of callback", result)

            console.log("What is RESULT DATA", result.data)
            console.log("What is ERROR MESSAGE", result.data.message)
            console.log("What is RESULT ERROR", { error: result.data.error})
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
                { shoppingCart.productList ? 
                <button onClick={()=> {
                const found = finder(product.price) 
                console.log("What is the found price", found)
                setProductId(product.id)
                setPrice(product.price)
                // setOrderId(shoppingCart.orderId)
                }} style={{color: finder ? "blue" : "red"}}>Add to Cart</button>
                 : <button>Add</button>
                }
               
            </form>
            </div>
            )}
             { errorMessage ? <div className="errorMessage" style={{backgroundColor: "yellow"}}
                   style={{display: error ? 'block' : 'none', textAlign: "center"}}
                    >{errorMessage}
                    <span className="close" style={{color: "red"}} onClick={() => setError(false)}> X CLOSE</span> 
                    </div> : '' }
        </>
    );
}

export default Products;