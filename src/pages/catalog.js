import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { agregarAlCarrito } from '../utils/carritoApi';
import { fetchProducts } from '../utils/api';
import SidebarFilters from '../components/SidebarFilters';
import AISidebar from '../components/AISidebar';
import { safeGetItem } from '../utils/storage';
import Image from 'next/image';
import {
  Box, Grid, Card, CardContent, Typography,
  Button, TextField, Dialog, DialogTitle, DialogContent, Stack
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Catalog = () => {
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [filters, setFilters] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [colores, setColores] = useState([]);
  const [densidades, setDensidades] = useState([]);
  const [iaSidebarOpen, setIaSidebarOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [descripcionOpen, setDescripcionOpen] = useState(false);
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = safeGetItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const data = await fetchProducts();
      setProductosOriginales(data);
      setFilteredProducts(data);
      setCategorias([...new Set(data.map(p => p.categoria))]);
      setMateriales([...new Set(data.map(p => p.material))]);
      setColores([...new Set(data.map(p => p.color))]);
      setDensidades([...new Set(data.map(p => p.densidad))]);
    } catch (err) {
      console.error('Error cargando catálogo:', err);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...productosOriginales];
    if (filters.category) filtrados = filtrados.filter(p => p.categoria === filters.category);
    if (filters.material) filtrados = filtrados.filter(p => p.material === filters.material);
    if (filters.color) filtrados = filtrados.filter(p => p.color === filters.color);
    if (filters.densidad) filtrados = filtrados.filter(p => p.densidad === filters.densidad);
    if (filters.price) filtrados = filtrados.filter(p => p.precio <= Number(filters.price));
    if (filters.inStock) filtrados = filtrados.filter(p => p.stock > 0);
    if (filters.enOferta) filtrados = filtrados.filter(p => p.oferta === true);
    if (filters.ordenarPor) {
      switch (filters.ordenarPor) {
        case 'precioAsc': filtrados.sort((a, b) => a.precio - b.precio); break;
        case 'precioDesc': filtrados.sort((a, b) => b.precio - a.precio); break;
        case 'nombreAsc': filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
        case 'nombreDesc': filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre)); break;
      }
    }
    setFilteredProducts(filtrados);
  };

  useEffect(() => { aplicarFiltros(); }, [filters]);

  const handleQuantityChange = (id, value) => {
    const num = parseInt(value);
    setQuantities({ ...quantities, [id]: num > 0 ? num : '' });
  };

  const addToCart = async (product) => {
    const cantidad = quantities[product._id] || 1;
    if (cantidad > product.stock) {
      alert(`Solo quedan ${product.stock} unidades.`);
      return;
    }
    try {
      await agregarAlCarrito({
        productoId: product._id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad,
        imagen: product.imagenes[0] || '',
        categoria: product.categoria,
        material: product.material,
        color: product.color,
        densidad: product.densidad
      });
      alert(`${product.nombre} agregado (${cantidad}).`);
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    }
  };

  const abrirDescripcion = (descripcion) => {
    setDescripcionProducto(descripcion || 'Sin descripción disponible.');
    setDescripcionOpen(true);
  };

  const cerrarDescripcion = () => {
    setDescripcionOpen(false);
  };

  const user = safeGetItem('user');

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7ff, #ffffff)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center', maxWidth: '1300px', mx: 'auto' }}>
        <Typography variant="h4" fontWeight={800}>🛒 Catálogo</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" startIcon={<FilterAltIcon />} onClick={() => setFiltersOpen(!filtersOpen)} sx={{ borderRadius: 8, fontWeight: 600 }}>Filtros</Button>
          <Button variant="contained" color="secondary" startIcon={<SmartToyIcon />} onClick={() => setIaSidebarOpen(!iaSidebarOpen)} sx={{ borderRadius: 8, fontWeight: 600 }}>IA</Button>
        </Stack>
      </Box>

      <Grid container spacing={3} maxWidth="1300px" mx="auto">
        {filteredProducts.filter(p => user?.rol === 'admin' || p.stock > 0).map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card sx={{ p: 1, boxShadow: 4, borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
              {product.imagenes.length > 0 && (
                <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Image src={product.imagenes[0]} alt={product.nombre} width={300} height={180} style={{ objectFit: 'cover', transition: 'transform 0.3s' }} priority />
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" fontWeight={800} color="primary.main" gutterBottom>{product.nombre}</Typography>
                <Typography color="text.secondary" fontSize={14}>{product.categoria} — {product.material}</Typography>
                <Typography sx={{ mt: 1 }}><strong>Color:</strong> {product.color}</Typography>
                <Typography><strong>Densidad:</strong> {product.densidad}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ display: 'inline-block', background: '#0070f3', color: 'white', px: 1.5, py: 0.5, borderRadius: '10px', fontWeight: 700 }}>
                    💵 {product.precio.toFixed(2)} Bs
                  </Typography>
                </Box>
                <Typography sx={{ mt: 1, fontWeight: 600 }}>{product.stock > 0 ? '🟢 Disponible' : '🔴 Sin stock'}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                  <TextField type="number" label="Cantidad" size="small" value={quantities[product._id] || ''} onChange={(e) => handleQuantityChange(product._id, e.target.value)} inputProps={{ min: 1 }} />
                  <Button variant="contained" onClick={() => addToCart(product)} disabled={product.stock === 0} sx={{ borderRadius: 10 }}>Agregar</Button>
                </Box>
                <Button size="small" variant="outlined" color="info" sx={{ mt: 1, borderRadius: 8, fontWeight: 600 }} onClick={() => abrirDescripcion(product.descripcion)}>
                  Ver descripción
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <SidebarFilters
        filters={filters}
        setFilters={setFilters}
        categorias={categorias}
        materiales={materiales}
        colores={colores}
        densidades={densidades}
        isOpen={filtersOpen}
        toggleSidebar={() => setFiltersOpen(!filtersOpen)}
      />

<AISidebar
  isOpen={iaSidebarOpen}
  onClose={() => setIaSidebarOpen(false)}
  toggleSidebar={() => setIaSidebarOpen(!iaSidebarOpen)}
  onFiltrarIA={(recomendados) => {
    const nombresIA = recomendados.map(r => r.nombre.toLowerCase());
    const filtradosIA = productosOriginales.filter(p =>
      nombresIA.some(nombreIA =>
        p.nombre.toLowerCase().includes(nombreIA)
      ) && p.stock > 0
    );
    setFilteredProducts(filtradosIA);
  }}
/>

      <Dialog open={descripcionOpen} onClose={cerrarDescripcion}>
        <DialogTitle>📝 Descripción del producto</DialogTitle>
        <DialogContent>
          <Typography>{descripcionProducto}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Catalog;
