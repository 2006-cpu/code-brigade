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
    const [ errorMessage , setErrorMessage ] = useState('')
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
                console.log("THE USER:", user.data)
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
            if (result.error) {
                console.log("gros probleme")
            }
        } catch(error) {
            console.error(error)
        }
    }
    
    return (<>   
    <div className="wrapper">
        <div className="form-wrapper">
            <h3>Register Here</h3>
            <p className="error" style={{color: "red"}}>{errorMessage}</p>
            <form onSubmit={handleSubmit}>
                    <div className="firstName">
                        <input type="text" placeholder={'First Name'} value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                    </div>
                    <div className="lastName">
                        <input type="text" placeholder={'Last Name'} value={lastName} onChange={(event) => setLastName(event.target.value)} />
                    </div>
                    <div className="email">
                        <input type="text" placeholder={'email'} value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                    <div className="username">
                        <input type="text" placeholder={'username'} value={username} onChange={(event) => setUsername(event.target.value)} />
                    </div>
                    <div className="password">
                         <input type="password" placeholder={'password'} value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                    <div className="image">
                        <input type="text" placeholder={'Image URL'} value={imageurl} onChange={(event) => setImageURL(event.target.value)} />
                    </div>
                    
                    <div className="createAccount">
                        <button type="submit" >Sign Up</button>
                    </div>

            </form>   
        </div>
    </div>
    </>)
}

export default Register;