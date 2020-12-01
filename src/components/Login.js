import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
// import NavBar from './NavBar'
import axios from 'axios';
import {loginUser, createInitialOrderId, getCartByUser} from '../api/index.js'

const BASE_URL = '/'

const Login = (props) => {
  const {setUser, setToken, setOrderId} = props
  const [login, setLogin] = useState({
    username: '',
    password: ''
  })
  const history = useHistory();
  const [ error, setError ] = useState('')


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
    setUser(user.data);
    console.log("THE USER:", user.data)
    
    setLogin({
      username: '',
      password: ''
    })

    if (data.error) {
      setError(data.message)
    }

    if (!data.error) {
      history.push('/products')
      } else { 
       return
    }

    const getCart = await getCartByUser(data.token)
    if (getCart.data.error) {
      const makeNewOrder = await createInitialOrderId('created', user.data.id)
      const orderId = setOrderId(makeNewOrder.id)
    }
  }

  return (
    <div className="wrapper">
      <div className="form-wrapper">
          <h2 className="auth-title">Login</h2>
            <form onSubmit={handleLogin}>
              <h3 className="login-title">Login Here</h3>
              <p className="error" style={{color: "red"}}>{error}</p>
              <input className="login-username" placeholder="Username" type="text" value={login.username} onChange={(e) => 
                setLogin({...login, username: e.target.value})} />
              <input className="login-pw" placeholder="Password" type="password" value={login.password} onChange={(e) => 
                setLogin({...login, password: e.target.value})} />
              <button type="submit">Login</button>
            </form>
      </div>
    </div>
  )    
}

export default Login;