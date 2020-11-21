import React, {useState} from 'react';
// import NavBar from './NavBar'
import axios from 'axios';
import {loginUser} from '../api/index.js'


const Login = (props) => {
  const { token, setToken} = props;
  const [login, setLogin] = useState({
    username: '',
    password: ''
  })

  const handleLogin = async (event) => {
    event.preventDefault();
    // loginUser(login.username, login.password)
    const result = await loginUser(login.username, login.password);
    console.log('result', result)
    setToken(result.token)
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