import React, { useRef } from 'react';
import { createProduct } from '../api';
import swal from 'sweetalert';


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

      <input placeholder={'Name'} ref={nameInputRef} />
      <input placeholder={'Description'} ref={descriptionInputRef} />
      <input placeholder={'Price'}ref={priceInputRef} />
      <input placeholder={'Image URL'} ref={imageurlInputRef} />
      <p><b>In Stock?:</b><input type="checkbox" ref={inStockInputRef} /></p>
      <input placeholder={'Category'} ref={categoryInputRef} />
      <button className="addProductButton" type="submit" onClick={() => {
        createProduct({
          name: nameInputRef.current.value,
          description: descriptionInputRef.current.value,
          price: priceInputRef.current.value,
          imageurl: imageurlInputRef.current.value,
          inStock: inStockInputRef.current.checked,
          category: categoryInputRef.current.value
        })
        setUpdateProduct(true)
        swal({
          title: "Success!",
          text: "Your Product was added!",
          icon: "success",
        });
      }}>Create Product</button>
    </div>
  )
}

export default CreateProducts;