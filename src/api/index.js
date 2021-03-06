import axios from 'axios';
const BASE_URL = '/'

export const getAllProducts = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/products`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/product/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id, token) => {
  const requestToken = {
      headers: { Authorization: `Bearer ${token}` }
  };
  try {
      const response = await axios.delete(`${ BASE_URL }api/products/${id}`, requestToken)
      return response;
  } catch (error) {
      console.error(error);
  }
};

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
};

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
};

export const getOrderById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/orders/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByProductId = async (productId) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/products/${productId}/orders`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByUser = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/users/${id}/orders`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getStripe = async (token, orderId) => {
  try {
    const { data } = await axios.post(`${BASE_URL}api/order_products/create-session`, {
      token: token,
      orderId: orderId
    })
    return data;
  } catch (error) {
    throw error;
  }
};

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
};

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
};

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
    return data;
  } catch (error) {
    throw error;
  }
}; 

export const completedOrder = async (id, token) => {
  const auth = {headers: {'Authorization': `Bearer ${token}`} }

  try {
    const { data } = await axios.delete(`${BASE_URL}api/orders/cart/${id}`, auth);
    return data;
  } catch (error) {
    throw error;
  }
};

export const editCartItem = async (orderProductId, price, quantity) => {
  try {
    const { data } = await axios.patch(`${BASE_URL}api/order_products/${orderProductId}`, {price, quantity})
    return data;
  } catch (error) {
    throw error
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/users/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}api/users/user/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const editUser = async (id, firstName, lastName, email, imageurl, username, password, isAdmin) => {
  try {
      const { data } = await axios.patch(`${ BASE_URL }api/users/${id}`, {firstName, lastName, email, imageurl, username, password, isAdmin})
      return data;
  } catch (error) {
      console.error(error);
  }
};

export const createProduct = async ({name, description, price, imageurl, inStock, category}) => {
  try {
    const { data } = await axios.post(`${ BASE_URL }api/products`, {name, description, price, imageurl, inStock, category})
      return data;
  } catch (error) {
      console.log(error)
  }
};

export const editProduct = async (id, name, description, price, imageurl, inStock, category) => {
  try {
    const { data } = await axios.patch(`${ BASE_URL }api/products/${id}`, {name, description, price, imageurl, inStock, category})
      return data;
  } catch (error) {
    console.error(error);
  }
};