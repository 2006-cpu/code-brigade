import React, { useRef } from 'react';
import { createProduct } from '../api'


const CreateProducts = (props) => {
  const {setUpdateProduct} = props
  const nameInputRef = useRef()
  const descriptionInputRef = useRef()
  const priceInputRef = useRef()
  const imageurlInputRef = useRef()
  const inStockInputRef = useRef()
  const categoryInputRef = useRef()



  return (
    <div className="mProductsCard">

      <p><b>Product Name:</b><input ref={nameInputRef} /></p>
      <p><b>Product Description:</b></p>
      <textarea style={{ border: "1px solid black" }} ref={descriptionInputRef} />
      <p><b>Price:</b><input ref={priceInputRef} /></p>
      <p><b>Image URL:</b><input ref={imageurlInputRef} /></p>
      <p><b>In Stock?:</b><input type="checkbox" ref={inStockInputRef} /></p>
      <p><b>Category:</b><input ref={categoryInputRef} /></p>
      <button style={{ backgroundColor: "green", width: "100px" }} type="submit" onClick={() => {
        createProduct({
          name: nameInputRef.current.value,
          description: descriptionInputRef.current.value,
          price: priceInputRef.current.value,
          imageurl: imageurlInputRef.current.value,
          inStock: inStockInputRef.current.checked,
          category: categoryInputRef.current.value
        })
        setUpdateProduct(true)
      }}>Create Product</button>
    </div>
  )
}

export default CreateProducts;