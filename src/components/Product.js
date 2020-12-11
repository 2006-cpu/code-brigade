import React from 'react';
import { useParams } from 'react-router-dom';

const Product = (props) => {
    const {productList} = props
    const {productId} = useParams();
    const product = productList.find(singleProduct => Number(productId) === singleProduct.id);


    return (
        <div>
            <h1 style={{marginTop: "2em"}}>Product</h1>
            {
            product && 
            <>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <div><img src={product.imageurl} alt="Mask" width="250" height="250"></img></div>
                <div>In Stock?
                    { product.inStock 
                ? <p>Yes</p> 
                : <p>No</p> 
                }</div>
                <p>{product.category}</p>
            </>}    
        </div>
    );
}


export default Product;