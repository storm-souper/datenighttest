import { apiUrl } from "./config";
import axios from 'axios';
import { getUserInfo } from "./localStorage";
import { parseRequestURL } from "./utils";

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

export const getProducts = async () => {
  try {
    const response = await axios({   
      url: `${apiUrl}/api/products`,
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

export const createProduct = async () => {
  try {
    const {token} = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/products`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.statusText !== 'Created') {
      throw new Error(response.data.message);
    }  
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
  }
};

export const updateProduct = async(product) => {
  try{
    const {token} = getUserInfo();
    const response = await axios ({
      url: `${apiUrl}/api/products/${product._id}`,
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: product,
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    } 
    return response.data;
  } catch(err){
    return {error: err.response.data.message || err.message}
  }
};

export const uploadProductImage = async(formData) => {
  try {
    const {token} = getUserInfo();
    const response = await axios ({
      url: `${apiUrl}/api/uploads`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',  
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    });
    if (response.statusText !== 'Created') {
      throw new Error(response.data.message);
    } 
    return response.data;
  } catch (err) {
    return {error: err.response.data.message || err.message};
  }
};

export const deleteProduct = async (productID) => {
  try {
    const {token} = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/products/${productID}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    }  
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
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

export const getOrders = async () => {
  const {token} = getUserInfo();
  try {
    const response = await axios({   
      url: `${apiUrl}/api/orders`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
};

export const deleteOrder = async (orderID) => {
  try {
    const {token} = getUserInfo();
    const response = await axios({
      url: `${apiUrl}/api/orders/${orderID}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    }  
    return response.data;
  } catch (err) {
    return { error: err.response.data.message || err.message };
  }
};

export const getPaypalClientID = async () => {
  const response = await axios ({
    url: `${apiUrl}/api/paypal/clientID`,
    headers: {
      'Content-Type': 'application/json',
    },
  }); 
  if (response.statusText !== 'OK') {
    throw new Error(response.data.message);
  }
  return response.data.clientID;
};

export const payOrder = async(orderID, paymentResult) => {
  try {
    const {token} = getUserInfo();
    const response = await axios ({
      url: `${apiUrl}/api/orders/${orderID}/pay`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: paymentResult,
    }); 
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
      return { error: (err.response 
        ? err.response.data.message 
        : err.message) };  
  };
};

export const getMyOrders = async () => {
  try {
    const {token} = getUserInfo();
    const response = await axios ({
      url: `${apiUrl}/api/orders/mine`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.statusText !== 'OK') {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    return { error: (err.response 
      ? err.response.data.message 
      : err.message) };
  };  
};

export const deliverOrder = async(orderID) => {
  try {
    const {token} = getUserInfo();
    const response = await axios ({
      url: `${apiUrl}/api/orders/${orderID}/deliver`,
      method: 'PUT',
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
      return { error: (err.response 
        ? err.response.data.message 
        : err.message) };  
  };
};

export const getSummary = async () => {
  try {
    const {token} = getUserInfo();
    const response = await axios ({
      url: `${apiUrl}/api/orders/summary`,
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
    return { error: (err.response 
      ? err.response.data.message 
      : err.message) };
  }
}