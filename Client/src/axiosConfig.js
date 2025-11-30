// /web/client/src/utils/axiosConfig.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your actual backend URL
  withCredentials: true,
  // Other configurations...
});

export default instance;
