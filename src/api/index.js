import axios from 'axios';
const BASE_URL = '/'

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
})
  const responseObj = await existingUser.json();

return responseObj;
  } catch(error) {
    console.error(error);
  }
}


export const getCartByUser = async (token) => {
  const auth = {headers: {'Authorization': `Bearer ${token}`} }
  try {
    const  data  = await axios.get(`${BASE_URL}api/orders/cart`, auth);
    if (data.error) {
      return
    } else {
      return data
    }
  } catch (error) {
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}api/orders`);
    // now we're going to filter based on orderId
    const order = response.data.filter(item => item.id === id)
    console.log('response:', response)
    return order;
  } catch (error) {
    throw error;
  }
}

export const getAllOrders = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/orders`);
    console.log('data:', data)
    return data;
  } catch (error) {
    throw error;
  }
}