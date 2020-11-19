import React from 'react';

const Products = (props) => {
    const {productList} = props
    console.log('zzzz', productList)

    return (
        <>
            {productList.map((product) => <div key={product.id}>

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
        )}
        </>
    );
}

export default Products;