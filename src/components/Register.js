import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import { createInitialOrderId } from '../api/index.js'
//new
import {  storeCurrentUser, storeCurrentToken  } from '../auth';
import './index.css';
const BASE_URL = '/'

const Register = (props) => {
    const { setUser, setToken, setOrderId } = props;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [imageurl, setImageURL] = useState('');
    const [errorMessage , setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const history = useHistory();

    
    const signUp = async ({firstName, lastName, email, username, password, imageurl, isAdmin}) => {
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
                setOrderId(0)
                setToken(responseToken);
                const auth = {
                    headers: {'Authorization': `Bearer ${responseToken}`
                }
                  }
                if (response.data.error) {
                    setErrorMessage(response.data.message)
                }

                if (!response.data.error) {
                    history.push('/products')
                    } else { 
                     return
                }

                const user = await axios.get(`${BASE_URL}api/users/me`, auth);
                const makeNewOrder = await createInitialOrderId('created', user.data.id)
                setUser(user.data);
                setOrderId(makeNewOrder.id)
             //new both below
             storeCurrentUser(user.data)  
             storeCurrentToken(responseToken) 
               
                return response;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = signUp({firstName, lastName, email, username, password, imageurl, isAdmin: false})
        } catch(error) {
            console.error(error)
        }
    }
    
    return (<>   
    <div className="wrapper">
        <div className="form-wrapper">
            <h3>Register Here</h3>
            <form onSubmit={handleSubmit}>
                    <div className="firstNameRegister">
                        <input type="text" required placeholder={'First Name'} title="Please provide a first name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                        {errors && errors.firstName && <p style={{color: "red"}}>{errors.firstName}</p>}
                    </div>
                    <div className="lastNameRegister">
                        <input type="text" required placeholder={'Last Name'} title="Please provide a last name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                        {errors && errors.lastName && <p style={{color: "red"}}>{errors.lastName}</p>}
                    </div>
                    <div className="email">
                        <input type="email" required pattern="[^ @]*@[^ @]*" title="Please provide an address email" placeholder={'email'} value={email} onChange={(event) => setEmail(event.target.value)} />
                        {errors && errors.email && <p style={{color: "red"}}>{errors.email}</p>}
                    </div>
                    <div className="username">
                        <input type="text" required title="Please provide a username" placeholder={'username'} value={username} onChange={(event) => setUsername(event.target.value)} />
                        {errors && errors.username && <p style={{color: "red"}}>{errors.username}</p>}
                    </div>
                    <div className="password">
                         <input type="password" required minLength="8" title="Password must be at least 8 or more characters" placeholder={'password'} value={password} onChange={(event) => setPassword(event.target.value)} />
                         {errors && errors.password && <p style={{color: "red"}}>{errors.password}</p>}
                    </div>
                    <div className="image">
                        <input type="text" placeholder={'Image URL'} value={imageurl} onChange={(event) => setImageURL(event.target.value)} />
                    </div>
                    <p className="error" style={{color: "red"}}>{errorMessage}</p>
                    <div className="createAccount">
                        <button type="submit" >Sign Up</button>
                    </div>

            </form>   
        </div>
    </div>
    </>)
}

export default Register;