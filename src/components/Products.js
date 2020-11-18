import React, { useEffect, useState } from 'react';
import { getAllProducts } from "../api"

const Products = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageurl, setImageurl] = useState('');
    const [inStock, setInStock] = useState('true');
    const [category, setCategory] = useState('');

    useEffect(() => {
        getAllProducts().then(response => setAllProducts(response)).catch(error => console.log(error))
    })

    return (<>
    <h1>PRODUCTS</h1>
    {allProducts && allProducts.map(({id, name, description, price, imageurl, inStock, category})=> 
        <div key={id}>
            <h2>{name}</h2>
            <p>{description}</p>
            <p>${price}</p>
            <a href={imageurl}/>
            <p>{inStock}</p>
            <p>{category}</p>
        </div>    
    )}
    </>)
};

export default Products;