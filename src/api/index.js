import React from 'react';
import axios from 'axios';

export const API_URL = "https://localhost:5000/api "

export async function getSomething() {
  try {
    const { data } = await axios.get('/api');
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAllProducts() {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
    })
    const responseObj = await response.json();
    console.log('responseObjProducts', responseObj)
    return responseObj
  } catch (error) {
    console.error(error)
  }
}