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

export const loginUser = async (username, password) => {
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

export const getAllOrders = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/orders`);
    return data;
  } catch (error) {
    throw error;
  }
}

export const getOrderById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/orders/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export const editOrder = async ({status, userId}, id) => {

  const body = {
      status: status,
      userId: userId,
  };
  try {
      const response = await axios.patch(`${ BASE_URL }api/orders/${id}`, body)
      return response;
  } catch (error) {
      console.error(error);
  }
}

export const deleteOrderProduct = async (id, token) => {
  const requestToken = {
      headers: { Authorization: `Bearer ${token}` }
  };
  try {
      const response = await axios.delete(`${ BASE_URL }api/order_products/${id}`, requestToken)
      return response;
  } catch (error) {
      console.error(error);
  }
}
//New Nov 28
export const createInitialOrderId = async (status, userId) => {
  try {
    const { data } = await axios.post(`${BASE_URL}api/orders`, {status, userId});
    return data;
  }catch (error) {
  }
};

export const cancelledOrder = async (id, token) => {
  const auth = {headers: {'Authorization': `Bearer ${token}`} }
  try {
    const { data } = await axios.delete(`${BASE_URL}api/orders/${id}`, auth);
    console.log('dataCancelledOrder', data);
    return data;
  } catch (error) {
    throw error;
  }
}; 

export const editCartItem = async (orderProductId, price, quantity, token) => {
  const auth = {headers: {'Authorization': `Bearer ${token}`}}
  try {
    const data = await axios.patch(`${BASE_URL}api/orders_products/${orderProductId}`,
    {price, quantity}
  )
    
  } catch (error) {
    throw error
  }
}