// frontend/src/services/api.js

import axios from 'axios';

// Create a new Axios instance
const api = axios.create({
  baseURL: '/api/v1',
});

export default api;
