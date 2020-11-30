import React, { useEffect, useState } from 'react';
import { getCartByUser, deleteOrderProduct, editOrder, editCartItem } from '../api/index.js'

const CartItem = ({ product, productIndex, token, handleRemove, handleEditCartItem }) => {

  return (
    <div key={productIndex}>
      <div key={product.id} style={{
        border: "1px solid gray",
        maxWidth: "500px", height: "400px", padding: "20px", topMargin: "10px"
      }}>
        <p>{product.name} {product.description}</p>
        <p>Product Id:{product.id}</p>
        <p>Order Product Id (for temporary testing):{product.orderProductId}</p>
        <p>Category: {product.category}</p>
        <img src={product.imageurl} alt="Mask" width="250" height="250"></img>
        <p>Price: ${product.price}</p>
      </div>
      <select onChange={(e) => {
        handleEditCartItem(product.id, product.price, e.target.value, token)
      }}>

        {[1, 2, 3, 4, 5].map(quantity => (
          <option value={quantity} key={quantity}>Quantity{quantity}</option>
        ))}
      </select>

      <button id={product.orderProductId} type="submit" onClick={handleRemove}>Remove From Cart</button>
    </div>
  )
};

export default CartItem;