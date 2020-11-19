import {React, useState, useEffect} from 'react';
import {getProduct} from '../api'

const Product = (id) => {
    const [product, setProduct] = useState({});

    const fetchProduct = () => {
        getProduct(id)
        .then(product => {
            setProduct(product);
        })
        .catch(error => {
            console.error(error);
        });
      }
    
      useEffect(() => {
        fetchProduct();
    }, [product]);

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <div><img src={product.imageURL} alt="Mask" width="500" height="600"></img></div>
            <div>In Stock?{ product.inStock 
                ? <p>Yes</p> 
                : <p>No</p> 
            }</div>
            <p>{product.category}</p>
        </div>
    );
}


export default Product;