import { useEffect, useState } from 'react';
import API from '@/utils/api';
import styles from '../../styles/AdminCatalogo.module.css';

const AdminCatalogo = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
  });
  const [imagenes, setImagenes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);

  const fetchProductos = async () => {
    try {
      const response = await API.get('/catalogo');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEliminar = async (productoId) => {
    try {
      await API.delete(`/catalogo/${productoId}`);
      setProductos(productos.filter((p) => p._id !== productoId));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleUploadImagenes = async (productoId, files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append('imagenes', file);
    }
    try {
     await API.post(`/catalogo/${productoId}/imagenes`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      await fetchProductos();
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
    }
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nuevoProducto.nombre);
    formData.append('precio', nuevoProducto.precio);
    formData.append('stock', nuevoProducto.stock);
    imagenes.forEach((file) => formData.append('imagenes', file));

    try {
      await API.post('/catalogo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNuevoProducto({ nombre: '', precio: '', stock: '' });
      setImagenes([]);
      await fetchProductos();
    } catch (error) {
      console.error('Error creando producto:', error);
    }
  };

  return (
    <div className={styles.adminCatalogoContainer}>
      <h2>Gestión del Catálogo</h2>

      <button
        className={styles.toggleFormButton}
        onClick={() => setMostrarForm(!mostrarForm)}
      >
        {mostrarForm ? 'Cerrar formulario' : 'Mostrar formulario'}
      </button>

      {mostrarForm && (
        <form className={styles.productForm} onSubmit={handleAgregarProducto}>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={nuevoProducto.stock}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
            }
            required
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImagenes(Array.from(e.target.files))}
          />
          <button type="submit">Crear Producto</button>
        </form>
      )}

      <div className={styles.productList}>
        {productos.map((producto) => (
          <div key={producto._id} className={styles.productItem}>
            <h3>{producto.nombre}</h3>
            <p><strong>Precio:</strong> {producto.precio} Bs</p>
            <p><strong>Stock:</strong> {producto.stock}</p>

            {producto.imagenes && producto.imagenes.length > 0 && (
              <img
                src={producto.imagenes[0]}
                alt={producto.nombre}
                className={styles.productImage}
              />
            )}

            <input
              type="file"
              multiple
              onChange={(e) =>
                handleUploadImagenes(producto._id, e.target.files)
              }
            />

            <button
              className={styles.eliminarButton}
              onClick={() => handleEliminar(producto._id)}
            >
              Eliminar Producto
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCatalogo;
