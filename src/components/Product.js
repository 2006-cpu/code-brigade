import React from 'react';
import { useParams } from 'react-router-dom';

const Product = (props) => {
    const {productList} = props
    console.log('zzzz', productList)
    const {productId} = useParams();
    const product = productList.find(singleProduct => productId == singleProduct.id);
    console.log('the product', product)


    return (
        <div>
            <h1>Product</h1>
            {product && <>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <div><img src={product.imageURL} alt="Mask" width="500" height="600"></img></div>
            <div>In Stock?{ product.inStock 
                ? <p>Yes</p> 
                : <p>No</p> 
            }</div>
            <p>{product.category}</p></>}
            
        </div>
    );
}


export default Product;