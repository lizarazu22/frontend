import axios from 'axios';
import { safeGetItem } from './storage';

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

// Listado de productos de catálogo
export const fetchProducts = async () => {
  const { data } = await API.get('/catalogo');
  return data;
};

// Login usuario
export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  return data;
};

// Registro usuario
export const signupUser = async (nombre, email, password) => {
  const { data } = await API.post('/auth/signup', { nombre, email, password });
  return data;
};

// Consultar recomendaciones IA
export const consultarIA = async (solicitud) => {
  const { data } = await API.post('/gpt/buscar', { solicitud });
  return data.sugerencias;
};

export default API;
