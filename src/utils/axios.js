import axios from 'axios';

// ----------------------------------------------------------------------
let HOST_API = process.env.REACT_APP_DEV_API_KEY;

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

window.addEventListener('storage', () => {
  HOST_API = localStorage.getItem('mode') === 'production' ? process.env.REACT_APP_PROD_API_KEY : process.env.REACT_APP_DEV_API_KEY;
  axiosInstance.defaults.baseURL = HOST_API;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
