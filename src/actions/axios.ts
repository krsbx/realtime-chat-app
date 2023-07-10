import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

instance.interceptors.request.use((config) => {
  let token = localStorage.getItem('token') || '';
  try {
    token = JSON.parse(token) as string;
  } catch {
    token = '';
  }

  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return config;
});

export default instance;
