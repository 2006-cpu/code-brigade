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

// export const signUp = async ({firstName, lastName, email, username, password, imageurl, isAdmin}) => {
//   try {
//     const response = await axios.post(`${ BASE_URL }api/users/register`, {firstName, lastName, email, username, password, imageurl, isAdmin})
//     const responseToken = response.data.token;
//     if(response){
//         setUsername('');
//         setPassword('');
//         setFirstName(''); 
//         setLastName('');
//         setEmail('');
//         setImageURL('');
//         setToken(responseToken);
//         const auth = {
//             headers: {'Authorization': `Bearer ${responseToken}`
//         }
//           }
//         const user = await axios.get(`${BASE_URL}api/users/me`, auth);
//         console.log("THE USER:", user.data)
//         setUser(user.data);
//         return response;
//     }
// } catch (error) {
//     console.error(error);
// }
// }

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