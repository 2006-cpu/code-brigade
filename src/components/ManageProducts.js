import React, { useState, useEffect } from 'react';
import {deleteProduct, getAllProducts} from '../api'
import CreateProduct from './CreateProduct'

const ManageProducts = (props) => {
    const {productList, setProductList, user, token} = props;
    const [updateProduct, setUpdateProduct] = useState(false);

    const fetchProducts = async () => {
        try {
          const products = await getAllProducts();
          setProductList(products);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [updateProduct]);

    const handleDelete = (e) => {
        e.preventDefault();
        deleteProduct(e.target.id, token);
        setProductList(productList);
        updateProduct ? setUpdateProduct(false) : setUpdateProduct(true);
      }

    return (<>
        {user && user.isAdmin &&
        <div className="m-products-div">
            <h1>Manage Products</h1>
            <CreateProduct />
            {productList.map(({id, name, description, price, imageurl, inStock, category}, idx) => 
                
                <div key={idx} className="mProductsCard">
                    
                    <p><b>Product ID:</b> {id}</p>
                    <p><b>Product Name:</b> {name}</p>
                    <p><b>Product Description:</b> {description}</p>
                    <p><b>Price:</b> {price}</p>
                    <p><b>Image URL:</b> {imageurl}</p>
                    <p><b>In Stock?:</b> {inStock ? <>Yes</> : <>No</> }</p>
                    <p><b>Category:</b> {category}</p>
                    <button style={{backgroundColor: "red"}}id={id} type="submit" onClick={handleDelete}>Delete Product</button>
                     
                </div>   
            )
            }
        </div>
        }
        
    </>)
}

export default ManageProducts;