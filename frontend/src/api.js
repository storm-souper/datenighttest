import { apiUrl } from "./config";
import axios from 'axios';
import { getUserInfo } from "./localStorage";

// function used to create link to backend server--
//  --to request data and get data of product from server 
export const getProduct = async (id) => {
  try {
    const response = await axios({   
      url: `${apiUrl}/api/products/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.statusText !== 'OK'){
      throw new Error(response.data.message);
    }
    return response.data
  } catch(err) {
    console.log(err);
    return {error: err.response.data.message || err.message};
  }
};

// function used to POST request to server to check if--
// -- any data's email and password that fits the request.--
// -- If yes then server will send response which is data.
export const signin = async({email, password}) => {
  try{
    const response = await axios ({
      url: `${apiUrl}/api/users/signin`,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: {
        email,
        password,
      }
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    } 
    return response.data;
  } catch(err){
    console.log(err);
    return {error: err.response.data.message || err.message}
  }
};

// function used to POST request to server to create--
// -- account with name email and password--
// -- then server will send response which is data.
export const register = async({name, email, password}) => {
  try{
    const response = await axios ({
      url: `${apiUrl}/api/users/register`,
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: {
        name,
        email,
        password,
      }
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    } 
    return response.data;
  } catch(err){
    console.log(err);
    return {error: err.response.data.message || err.message}
  }
};

export const update = async({name, email, password}) => {
  try{
    const {_id, token} = getUserInfo();
    const response = await axios ({
      url: `${apiUrl}/api/users/${_id}`,
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        email,
        password,
      }
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    } 
    return response.data;
  } catch(err){
    console.log(err);
    return {error: err.response.data.message || err.message}
  }
};

export const createOrder = async (order) => {
  try {
    const {token} = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    data: order,
    });
    if (response.statusText !== 'Created') {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    return { error: (err.response 
      ? err.response.data.message 
      : err.message) };
  } 
};

export const getOrder = async (id) => {
  try {
    const {token} = getUserInfo();
    const response = await axios ({
      url: `${apiUrl}/api/orders/${id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    return {error: err.message};
  }
  
}