import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import withAuth from '../../middlewares/withAuth';
import { fetchProducts } from '../../utils/api';
import API from '../../utils/api';
import styles from '../../styles/AdminCatalogo.module.css';
import Image from 'next/image';

const CATEGORIAS = ['Categoría 1', 'Categoría 2', 'Categoría 3'];
const MATERIALES = ['Material 1', 'Material 2', 'Material 3'];
const COLORES = ['Color 1', 'Color 2', 'Color 3'];
const DENSIDADES = ['Densidad 1', 'Densidad 2', 'Densidad 3'];

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    material: '',
    color: '',
    densidad: '',
  });
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      const data = await fetchProducts();
      setProductos(data);
    };
    cargarProductos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const iniciarEdicion = (producto) => {
    setProductoEditando(producto._id);
    setFormulario({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      material: producto.material,
      color: producto.color,
      densidad: producto.densidad,
    });
    setImagenes([]);
  };

  const cancelarEdicion = () => {
    setProductoEditando(null);
    setFormulario({
      nombre: '',
      precio: '',
      stock: 0,
      categoria: '',
      material: '',
      color: '',
      densidad: '',
    });
    setImagenes([]);
  };

  const guardarCambios = async () => {
    try {
      await API.put(`/admin/productos/${productoEditando}`, formulario);

      if (imagenes.length > 0) {
        const formData = new FormData();
        imagenes.forEach((file) => formData.append('imagenes', file));

        await API.post(`/admin/productos/${productoEditando}/imagenes`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      const data = await fetchProducts();
      setProductos(data);
      cancelarEdicion();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const crearProducto = async () => {
    if (!formulario.nombre || formulario.precio === '' || formulario.stock === '') {
      alert('Completa todos los campos');
      return;
    }

    try {
      const formData = new FormData();
      for (const key in formulario) {
        formData.append(key, formulario[key]);
      }
      imagenes.forEach((file) => formData.append('imagenes', file));

      const res = await API.post('/admin/productos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProductos([...productos, res.data]);
      cancelarEdicion();
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error creando producto:', error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await API.delete(`/admin/productos/${id}`);
        setProductos(productos.filter((p) => p._id !== id));
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  const eliminarImagen = async (productoId, url) => {
    if (window.confirm('¿Eliminar esta imagen?')) {
      try {
        await API.put(`/admin/productos/${productoId}/imagenes/eliminar`, { url });
        const data = await fetchProducts();
        setProductos(data);
      } catch (error) {
        console.error('Error eliminando imagen:', error);
      }
    }
  };

  const mostrarNuevasImagenes = () => {
    return imagenes.map((img, idx) => (
      <div key={idx} style={{ position: 'relative' }}>
        <Image src={URL.createObjectURL(img)} alt="preview" width={300} height={200} style={{ objectFit: 'cover', borderRadius: '6px' }} />
      </div>
    ));
  };

  const subirImagenes = async (productoId, files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append('imagenes', file);
    }
    try {
      await API.post(`/admin/productos/${productoId}/imagenes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = await fetchProducts();
      setProductos(data);
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
    }
  };

  return (
    <div className={styles.adminCatalogoContainer}>
      <AdminNavbar />
      <h1>Gestión de Productos</h1>

      <button className={styles.toggleFormButton} onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario ? 'Cerrar formulario' : 'Agregar nuevo producto'}
      </button>

      {mostrarFormulario && (
        <div className={styles.productForm}>
          <input name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={manejarCambio} />
          <input name="precio" type="number" placeholder="Precio" value={formulario.precio} onChange={manejarCambio} />
          <input name="stock" type="number" placeholder="Stock" value={formulario.stock} onChange={manejarCambio} />
          <select name="categoria" value={formulario.categoria} onChange={manejarCambio}>
            {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select name="material" value={formulario.material} onChange={manejarCambio}>
            {MATERIALES.map((mat) => <option key={mat} value={mat}>{mat}</option>)}
          </select>
          <select name="color" value={formulario.color} onChange={manejarCambio}>
            {COLORES.map((col) => <option key={col} value={col}>{col}</option>)}
          </select>
          <select name="densidad" value={formulario.densidad} onChange={manejarCambio}>
            {DENSIDADES.map((den) => <option key={den} value={den}>{den}</option>)}
          </select>
          <input type="file" multiple onChange={(e) => setImagenes(Array.from(e.target.files))} />
          <button onClick={crearProducto}>Crear Producto</button>
        </div>
      )}

      <div className={styles.productList}>
        {productos.map((prod) => (
          <div key={prod._id} className={styles.productItem}>
            {prod.imagenes && prod.imagenes.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <Image src={img} alt={prod.nombre} width={300} height={200} style={{ objectFit: 'cover', borderRadius: '6px' }} />
                {productoEditando === prod._id && (
                  <button className={styles.eliminarButton} onClick={() => eliminarImagen(prod._id, img)}>Eliminar imagen</button>
                )}
              </div>
            ))}

            {productoEditando === prod._id ? (
              <>
                <input name="nombre" value={formulario.nombre} onChange={manejarCambio} />
                <input name="precio" type="number" value={formulario.precio} onChange={manejarCambio} />
                <input name="stock" type="number" value={formulario.stock} onChange={manejarCambio} />
                <select name="categoria" value={formulario.categoria} onChange={manejarCambio}>
                  {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select name="material" value={formulario.material} onChange={manejarCambio}>
                  {MATERIALES.map((mat) => <option key={mat} value={mat}>{mat}</option>)}
                </select>
                <select name="color" value={formulario.color} onChange={manejarCambio}>
                  {COLORES.map((col) => <option key={col} value={col}>{col}</option>)}
                </select>
                <select name="densidad" value={formulario.densidad} onChange={manejarCambio}>
                  {DENSIDADES.map((den) => <option key={den} value={den}>{den}</option>)}
                </select>
                <input type="file" multiple onChange={(e) => setImagenes(Array.from(e.target.files))} />
                {imagenes.length > 0 && mostrarNuevasImagenes()}
                <button onClick={guardarCambios}>Guardar</button>
                <button onClick={cancelarEdicion}>Cancelar</button>
              </>
            ) : (
              <>
                <h3>{prod.nombre}</h3>
                <p>💵 Precio: {prod.precio} Bs</p>
                <p>📦 Stock: {prod.stock}</p>
                <p>📁 Categoría: {prod.categoria}</p>
                <p>🧵 Material: {prod.material}</p>
                <p>🎨 Color: {prod.color}</p>
                <p>⚖️ Densidad: {prod.densidad}</p>
                <button onClick={() => iniciarEdicion(prod)}>Editar</button>
                <button onClick={() => eliminarProducto(prod._id)}>Eliminar</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Productos, ['admin']);
