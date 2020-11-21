import React, { useState } from 'react';
import axios from 'axios';
const BASE_URL = '/'



const Register = (props) => {
    const { setUser, setToken } = props;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [imageURL, setImageURL] = useState('');
    
    const signUp = async ({firstName, lastName, email, username, password, imageURL, isAdmin}) => {
        try {
            const response = await axios.post(`${ BASE_URL }api/users/register`, {firstName, lastName, email, username, password, imageURL, isAdmin})
            const responseToken = response.data.token;
            if(response){
                setUsername('');
                setPassword('');
                setFirstName('');
                setLastName('');
                setEmail('');
                setImageURL('');
                setToken(responseToken);
                const auth = {
                    headers: {'Authorization': `Bearer ${responseToken}`
                }
                  }
                const user = await axios.get(`${BASE_URL}api/users/me`, auth);
                console.log("THE USER:", user)
                if(user && user.username) {
                    setUser(user);
                }
                return response;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        signUp({firstName, lastName, email, username, password, imageURL, isAdmin: false})
    }
    
    
    return (<>   
        <form onSubmit={handleSubmit}>
        <h3>Register Here</h3>
        <input type="text" placeholder={'First Name'} value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        <input type="text" placeholder={'Last Name'} value={lastName} onChange={(event) => setLastName(event.target.value)} />
        <input type="text" placeholder={'email'} value={email} onChange={(event) => setEmail(event.target.value)} />
        <input type="text" placeholder={'username'} value={username} onChange={(event) => setUsername(event.target.value)} />
        <input type="password" placeholder={'password'} value={password} onChange={(event) => setPassword(event.target.value)} />
        <input type="text" placeholder={'Image URL'} value={imageURL} onChange={(event) => setImageURL(event.target.value)} />
        <button type="submit" >Sign Up</button>
      </form>        
    </>)
}

export default Register;