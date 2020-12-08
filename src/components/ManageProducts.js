import React, { useState, useEffect } from 'react';
import CreateProduct from './CreateProduct'
import { NavLink } from 'react-router-dom';
import {deleteProduct, getAllProducts, editProduct} from '../api';
import swal from 'sweetalert';


const ManageProducts = (props) => {
    const {productList, setProductList, user, token} = props;
    const [updateProduct, setUpdateProduct] = useState(false);
    const [ productIdToEdit, setProductIdToEdit ] = useState(1)
    const [ nameToEdit, setNameToEdit ] = useState('')
    const [ descriptionToEdit, setDescriptionToEdit ] = useState('')
    const [ priceToEdit, setPriceToEdit ] = useState(0)
    const [ imageurlToEdit, setImageurlToEdit ] = useState('')
    const [ inStockToEdit, setInStockToEdit ] = useState(true)
    const [ categoryToEdit, setCategoryToEdit ] = useState('')
    const [ editingProduct, setEditingProduct ] = useState(false)
    const [isActive, setIsActive] = useState(false)

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
    }, [updateProduct, editingProduct]);

    const handleDelete = (e) => {
        e.preventDefault();
        deleteProduct(e.target.id, token);
        setProductList(productList);
        swal({
          title: "Success!",
          text: "Changes saved",
          icon: "success",
        });
        updateProduct ? setUpdateProduct(false) : setUpdateProduct(true);
      }

    const handleEditSubmit = async (event) => {
        event.preventDefault()
        try {
            await editProduct(productIdToEdit, nameToEdit, descriptionToEdit, priceToEdit, imageurlToEdit, inStockToEdit, categoryToEdit)
            setEditingProduct(false)
            swal({
              title: "Success!",
              text: "Changes saved",
              icon: "success",
            });
        } catch (error) {
          console.error(error)
        }
    };

    return (<>
        {user && user.isAdmin &&
        <div className="m-products-div">
            <h1 style={{marginTop: "2em"}}>Manage Products</h1>

            <button className="addProductButton" onClick={setIsActive}>Create Product</button>
            { isActive ? 
              <CreateProduct setUpdateProduct={setUpdateProduct} setIsActive={setIsActive}/>  
             : ''}
            {productList.map(({id, name, description, price, imageurl, inStock, category}, idx) => 
                
                <div key={idx} className="mProductsCard">
                    <>
                    <p><b>Product ID:</b> {id}</p>
                    <p><b>Product Name:</b> {name}</p>
                    <p><b>Product Description:</b> {description}</p>
                    <p><b>Price:</b> {price}</p>
                    <p><b>Image URL:</b> {imageurl}</p>
                    <p><b>In Stock?:</b> {inStock ? <>Yes</> : <>No</> }</p>
                    <p><b>Category:</b> {category}</p>
                    </>
                    <NavLink style={{backgroundColor: "grey", color: "black", fontSize: "12px", margin: "2px",display: "flex", justifyContent: "center"}}to={"/products/" + id + "/orders"} activeClassName="current">Orders With This Product</NavLink>

   
                    <button className="editProduct"
                            onClick={() => {
                            setEditingProduct(true)
                            setNameToEdit(name)
                            setProductIdToEdit(id)
                            }}>Edit</button>

                    <button style={{backgroundColor: "red"}}id={id} type="submit" onClick={handleDelete}>Delete Product</button>
                     
                </div>   
            )
            }
        </div>
        }

        <form className='productEditForm' 
            style={{ display: editingProduct? 'flex' : 'none' }}
            onSubmit={handleEditSubmit}
            >
            <h2 className="nameHeading" style={{display: "flex", justifyContent: "space-between"}}><span>Edit Product</span> 
            <span className="close" style={{color: "red", backgroundColor: "white", padding: "5px", fontSize: "14px"}}
            onClick={() => setEditingProduct(false)}
            >X CLOSE</span> 
            </h2>
            <label >Name</label>
            <input type="text" placeholder="name" value={ nameToEdit } onChange={(event) => { setNameToEdit(event.target.value) }}/>
            <label>Description</label>
            <input type="text" placeholder="description" value={ descriptionToEdit } onChange={(event) => { setDescriptionToEdit(event.target.value) }}/>
            <label>Price</label>
            <input type="number" placeholder="price" value={ priceToEdit } onChange={(event) => { setPriceToEdit(event.target.value) }}/>
            <label>Image URL</label>
            <input placeholder="Image URL" value={ imageurlToEdit } onChange={(event) => { setImageurlToEdit(event.target.value) }}/>

            <label>Is Stock?</label>
            <select value={ inStockToEdit } style={{width: "50px", alignSelf: "center"}}
                onChange={(event) => {setInStockToEdit (event.target.value)}} name="isStock">
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </select>

            <label>Category</label>
            <input type="text" placeholder="category" value={ categoryToEdit } onChange={(event) => { setCategoryToEdit(event.target.value) }}/>
            <button style={{padding: "5px", border: "1 solid black"}}>Submit Edit</button>
        </form>
        
    </>)
}

export default ManageProducts;
