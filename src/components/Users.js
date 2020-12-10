import React, {useState, useEffect }from 'react';
import { NavLink } from 'react-router-dom';
import {getAllUsers} from '../api'
import axios from 'axios';
import swal from 'sweetalert';
const BASE_URL = '/'

const Users = (props) => {
    const {user} = props;
    const [users, setAllUsers] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [imageurl, setImageURL] = useState('');   
    const [isAdmin, setIsAdmin] = useState(false)
    const [ userAdded, setUserAdded] = useState(false)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        getAllUsers()
       .then(allUsers => {
        setAllUsers(allUsers);
       })
       .catch(error => {
           console.error(error)
       });
    }, [userAdded]);


    const signUp = async ({firstName, lastName, email, username, password, imageurl, isAdmin}) => {
        setUserAdded(false)
        try {
        const response = await axios.post(`${ BASE_URL }api/users/register`, {firstName, lastName, email, username, password, imageurl, isAdmin})
        const responseToken = response.data.token;
        if(response){
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setImageURL('');
        setUserAdded(true)
        setIsActive(false);
        return response;
        }
    
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp({firstName, lastName, email, username, password, imageurl, isAdmin})
            swal({
              title: "Success!",
              text: "A new user was added!",
              icon: "success",
            });
        } catch(error) {
        console.error(error)
        }
    };

    
    return (<>

        <h1 style={{marginTop: "2em"}}>Create New User</h1>
        <div className="wrapper">
            <button className="addProductButton" id="centered-toggle" onClick={setIsActive}>Add Users</button>
        </div>
            { isActive ? 

            <form className="createNewUser"
                onSubmit={handleSubmit}>
                <input type="text" required placeholder={'First Name'} title="Please provide a first name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                <input type="text" required placeholder={'Last Name'} value={lastName} onChange={(event) => setLastName(event.target.value)} />
                <input type="email" required pattern="[^ @]*@[^ @]*" placeholder={'Email'} value={email} onChange={(event) => setEmail(event.target.value)} />
                <input type="text" required title="Please provide a username" placeholder={'Username'} value={username} onChange={(event) => setUsername(event.target.value)} />
                <input type="password" required minLength="8" title="Password must be at least 8 or more characters" placeholder={'Password'} value={password} onChange={(event) => setPassword(event.target.value)} />
                <input type="text" placeholder={'Image URL'} value={imageurl} onChange={(event) => setImageURL(event.target.value)} />
                <label>Is Admin?</label>
                <select value={ isAdmin} 
                    style={{width: "50px"}}
                    onChange={(event) => {setIsAdmin(event.target.value)}}
                    name="isAdmin">
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
                    
                <button type="submit" >Sign Up</button>
                </form>  
                
                : ''}
        
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