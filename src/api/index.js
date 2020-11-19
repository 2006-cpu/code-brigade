import axios from 'axios';
const BASE_URL = 'http://localhost:5000/'

export async function getSomething() {
  try {
    const { data } = await axios.get('/api');
    return data;
  } catch (error) {
    throw error;
  }
}

export const getProduct = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/product/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
}