import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || ''; // or anywhere that you store the token

  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return config;
});

export default instance;
