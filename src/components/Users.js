import React, {useState, useEffect }from 'react';
import { NavLink } from 'react-router-dom';
import {getAllUsers} from '../api'

const Users = (props) => {
    const {user} = props;
    const [users, setAllUsers] = useState([]);

    useEffect(() => {
        getAllUsers()
       .then(allUsers => {
        setAllUsers(allUsers);
       })
       .catch(error => {
           console.error(error)
       });
    }, []);
    
    return (<>
        {user && user.isAdmin &&
        <div className="orders-div">
            <h1>All Users</h1>
            {users.map(({id, username, firstName, lastName, imageurl, isAdmin}, idx) => 
                
                <div key={idx} className="usersCard">
                    <>
                    <p>User Number: {id}</p>
                    <p>Username: {username}</p>
                    <p>First Name: {firstName}</p>
                    <p>Last Name: {lastName}</p>
                    <NavLink to={"/users/" + id} activeClassName="current">Details</NavLink>
                    </>
                </div>
            )
            }
        </div>
        }
        
    </>)
}

export default Users;