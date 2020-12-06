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
            <section>
            {users.map(({id, username, firstName, lastName, imageurl, isAdmin}, idx) => 
                
                <div key={idx} className="usersCard">
                    
                    <div className="userId">
                    <p>User Number: {id}</p>    
                    </div>
                    <div className="username">
                    <p>Username: {username}</p>
                    </div>
                    <div className="firstName">
                    <p>First Name: {firstName}</p>    
                    </div>
                    <div className="lastName">
                    <p>Last Name: {lastName}</p>
                    </div>
                    <NavLink to={"/users/" + id} activeClassName="current">Details</NavLink>
                    
                </div>
            )}
            </section>
        </div>
        }

  
    </>)
}

export default Users;