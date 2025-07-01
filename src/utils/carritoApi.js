import API from './api';

// Agregar producto al carrito
export const agregarAlCarrito = async (producto) => {
  try {
    const res = await API.post('/carrito/agregar', { producto });
    return res.data;
  } catch (error) {
    console.error('Error en agregarAlCarrito:', error);
    throw error;
  }
};

// Obtener carrito autenticado
export const obtenerCarrito = async () => {
  try {
    const res = await API.get('/carrito');
    return res.data;
  } catch (error) {
    console.error('Error en obtenerCarrito:', error);
    throw error;
  }
};

// Vaciar carrito autenticado
export const vaciarCarrito = async () => {
  try {
    const res = await API.delete('/carrito');
    return res.data;
  } catch (error) {
    console.error('Error en vaciarCarrito:', error);
    throw error;
  }
};

// Actualizar cantidad
export const actualizarCantidad = async (productoId, cantidad) => {
  try {
    const res = await API.put(`/carrito/producto/${productoId}`, { cantidad });
    return res.data;
  } catch (error) {
    console.error('Error en actualizarCantidad:', error);
    throw error;
  }
};

// Eliminar producto
export const eliminarProductoCarrito = async (productoId) => {
  try {
    const res = await API.delete(`/carrito/producto/${productoId}`);
    return res.data;
  } catch (error) {
    console.error('Error en eliminarProductoCarrito:', error);
    throw error;
  }
};
