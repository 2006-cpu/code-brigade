import React, {useState} from 'react';
// import NavBar from './NavBar'
import axios from 'axios';
import {loginUser} from '../api/index.js'
const BASE_URL = '/'


const Login = (props) => {
  const {setUser, setToken} = props
  const [login, setLogin] = useState({
    username: '',
    password: ''
  })

  const handleLogin = async (event) => {
    event.preventDefault();
    
    const data = await loginUser(login.username, login.password);
    console.log('data:', data);
    setToken(data.token);
    const auth = {
        headers: {'Authorization': `Bearer ${data.token}`
    }
      }
    const user = await axios.get(`${BASE_URL}api/users/me`, auth);
    console.log("THE USER:", user)
    if(user && user.username) {
        setUser(user);
    }
  }

  return (
    <div>
    <h2 className="auth-title">Login</h2>
      <form onSubmit={handleLogin}>
        <h3 className="login-title">Login Here</h3>
        <input className="login-username" placeholder="Username" type="text" value={login.username} onChange={(e) => 
          setLogin({...login, username: e.target.value})} />
        <input className="login-pw" placeholder="Password" type="password" value={login.password} onChange={(e) => 
          setLogin({...login, password: e.target.value})} />
        <button type="submit">Login</button>
      </form>
    </div>
  )    
}

export default Login;