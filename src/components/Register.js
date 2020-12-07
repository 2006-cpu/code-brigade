import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import { createInitialOrderId, editOrder } from '../api/index.js'
import { storeCurrentUser, storeCurrentToken } from '../auth';
import './index.css';
const BASE_URL = '/'

const Register = (props) => {
    const { setUser, setToken, setOrderId, orderId } = props;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [imageurl, setImageURL] = useState('');
    const [errorMessage , setErrorMessage] = useState('');
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

                if (orderId) {
                const edit = await editOrder({status: 'created', userId: user.data.id}, orderId)
                setOrderId(edit.data.id)
                } else {
                const makeNewOrder = await createInitialOrderId('created', user.data.id)
                setOrderId(makeNewOrder.id)
                }
                setUser(user.data);
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
            await signUp({firstName, lastName, email, username, password, imageurl, isAdmin: false})
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
                    </div>
                    <div className="lastNameRegister">
                        <input type="text" required placeholder={'Last Name'} title="Please provide a last name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                    </div>
                    <div className="email">
                        <input type="email" required pattern="[^ @]*@[^ @]*" title="Please provide an address email" placeholder={'email'} value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                    <div className="username">
                        <input type="text" required title="Please provide a username" placeholder={'username'} value={username} onChange={(event) => setUsername(event.target.value)} />
                    </div>
                    <div className="password">
                         <input type="password" required minLength="8" title="Password must be at least 8 or more characters" placeholder={'password'} value={password} onChange={(event) => setPassword(event.target.value)} />
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