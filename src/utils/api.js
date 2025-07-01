import axios from 'axios';
import { safeGetItem } from './storage';

// Debug para producción: logear la baseURL cuando se inicializa API
console.log("Base URL cargada en Axios:", process.env.NEXT_PUBLIC_API_URL);

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para añadir token automáticamente desde localStorage o sessionStorage
API.interceptors.request.use((config) => {
  const token = safeGetItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProducts = async () => {
  const { data } = await API.get('/catalogo');
  return data;
};

export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  return data;
};

export const signupUser = async (nombre, email, password) => {
  const { data } = await API.post('/auth/signup', { nombre, email, password });
  return data;
};

export const consultarIA = async (solicitud) => {
  const { data } = await API.post('/gpt/buscar', { solicitud });
  return data.sugerencias;
};

export default API;
