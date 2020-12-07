import React, {useState, useEffect} from 'react';
import {getOrdersByUser} from '../api'

const Account = (props) => {
    const {user} = props;
    const [userOrders, setUserOrders] = useState([]);
    console.log("account user:", user)

    const getUserOrders = async () => {
        try {
            const orders = await getOrdersByUser(user.id);
            setUserOrders(orders);
            console.log('orderssss:', orders) 
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserOrders();
    }, []);

    return (
        <>
            <h1 style={{marginTop: "2em"}}>{user.username}'s Account</h1>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}className="userCard">
            { user.imageurl ?
            <div><img src={user.imageurl} alt={user.username} width="250" height="250"></img></div>
             : 
             <div><img src='https://picsum.photos/200' alt={user.username} width="250" height="250"></img></div>
            }
                <div  style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}} key={user.id} className="userContainer">
                    <p><b>First Name:</b> {user.firstName}</p>
                    <p><b>Last Name:</b> {user.lastName}</p>
                    <p><b>Email:</b> {user.email}</p>
                        <div>{
                            user.isAdmin 

                            ? <p><b>Is Admin:</b> Yes</p>

                            : <p><b>Is Admin:</b> No</p>
                        
                        }</div>
                </div>
            </div>
            <div>{
                userOrders.map(({datePlaced, id, productList, status}) =>{
                    const date = datePlaced.slice(0,10)
                    return(
                        <div style={{marginTop: "5px"}}key={ id }>
                            <section style={{boxShadow: "1px 1px 1px 1px black", borderRadius: "10px"}}>
                                <h3>Order Number: {id} </h3>
                                <p>Date Placed: {date}</p>
                                {productList.map(({id, name, price, imageurl, quantity}) => {
                                    return(
                                        <div style={{borderTop: "1px solid grey"}}key={id}>
                                            <section style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                                                <h4>{name}</h4>
                                                <p>Quantity: {quantity}</p>
                                                <p>Price: ${price}</p>
                                                <p>Status: {status}</p>
                                                <img src={imageurl} alt={name} width="150"/>
                                            </section>
                                            

                                        </div>
                                            
                                    )
                                })}
                                
                            </section>
                        </div>
                    ) 
                })
                }</div>
        </>

    )

}

export default Account;