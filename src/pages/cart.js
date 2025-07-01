import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  obtenerCarrito,
  vaciarCarrito,
  actualizarCantidad,
  eliminarProductoCarrito
} from '../utils/carritoApi';
import Image from 'next/image';
import { safeGetItem } from '../utils/storage';
import {
  Box, Typography, Grid, Button, TextField, Paper, Stack
} from '@mui/material';

const Cart = () => {
  const [carrito, setCarrito] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = safeGetItem('user');
    if (!user) {
      router.push('/login');
    } else {
      cargarCarrito();
    }
  }, []);

  const cargarCarrito = async () => {
    try {
      const data = await obtenerCarrito();
      setCarrito(data);
    } catch (err) {
      console.error('Error cargando carrito:', err);
      setCarrito({ productos: [] });
    }
  };

  const eliminarProducto = async (productoId) => {
    await eliminarProductoCarrito(productoId);
    cargarCarrito();
  };

  const actualizarCantidadProducto = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) return;
    await actualizarCantidad(productoId, nuevaCantidad);
    cargarCarrito();
  };

  const vaciarTodoElCarrito = async () => {
    await vaciarCarrito();
    cargarCarrito();
  };

  const calcularTotal = () =>
    carrito?.productos?.reduce((t, p) => t + p.precio * p.cantidad, 0) || 0;

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>🛒 Tu Carrito</Typography>

      {carrito?.productos?.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {carrito.productos.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
                  {item.imagen && (
                    <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        width={300}
                        height={180}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                        priority
                      />
                    </Box>
                  )}
                  <Typography variant="h6" gutterBottom>{item.nombre}</Typography>
                  <Typography color="text.secondary">{item.precio.toFixed(2)} Bs</Typography>
                  <Typography><strong>Categoría:</strong> {item.categoria}</Typography>
                  <Typography><strong>Material:</strong> {item.material}</Typography>
                  <Typography><strong>Color:</strong> {item.color}</Typography>
                  <Typography><strong>Densidad:</strong> {item.densidad}</Typography>
                  <Typography><strong>Stock:</strong> {item.stock}</Typography>

                  <TextField
  label="Cantidad"
  type="number"
  size="small"
  value={item.cantidad}
  onChange={(e) => {
    const val = e.target.value;
    if (val === '') {
      actualizarCantidadProducto(item.productoId, '');  // deja en blanco momentáneamente
      return;
    }
    const num = parseInt(val);
    if (isNaN(num) || num < 1) return;
    if (num > item.stock) {
      alert(`Stock máximo disponible: ${item.stock}`);
      return;
    }
    actualizarCantidadProducto(item.productoId, num);
  }}
  onBlur={(e) => {
    if (e.target.value === '' || parseInt(e.target.value) < 1) {
      actualizarCantidadProducto(item.productoId, 1);
    }
  }}
  inputProps={{ min: 1, max: item.stock }}
  sx={{ mt: 1, width: 80 }}
/>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 8 }}
                    onClick={() => eliminarProducto(item.productoId)}
                  >
                    Eliminar
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" textAlign="center" mt={4}>
            Total: {calcularTotal().toFixed(2)} Bs
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={3} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/metodo-pago')}
              sx={{ borderRadius: 10, fontWeight: 600 }}
            >
              Finalizar Compra
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={vaciarTodoElCarrito}
              sx={{ borderRadius: 10 }}
            >
              Vaciar Carrito
            </Button>
            <Button
              variant="text"
              onClick={() => router.push('/catalog')}
              sx={{ borderRadius: 10 }}
            >
              Volver al Catálogo
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Typography textAlign="center" color="text.secondary" fontSize={18} mt={5}>
            No tienes productos en el carrito.
          </Typography>
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              onClick={() => router.push('/catalog')}
              sx={{ borderRadius: 10 }}
            >
              Volver al Catálogo
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
