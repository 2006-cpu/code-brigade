import axios from 'axios';
const BASE_URL = '/'

export async function getSomething() {
  try {
    const { data } = await axios.get('api');
    return data;
  } catch (error) {
    throw error;
  }
}

export const getAllProducts = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/products`);
    console.log('data:', data)
    return data;
  } catch (error) {
    throw error;
  }
}

export const getProduct = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/product/${id}`);
    console.log('data:', data)
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(username, password) {
  try {
    const existingUser = await fetch(`${BASE_URL}api/users/login`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: username,
    password: password
  })
}).then(response => response.json())
  .then(result => {
    localStorage.setItem('token', result.token);
    localStorage.setItem('username', username)
    console.log(result);
  })
  .catch(console.error);
    return existingUser;
  } catch (error) {
    throw error;
  }
}