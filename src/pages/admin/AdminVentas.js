import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/AdminVentas.module.css';
import AdminNavbar from '../../components/AdminNavbar';

const AdminVentas = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    obtenerTodasLasVentas();
  }, []);

  const obtenerTodasLasVentas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ventas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener todas las ventas:', error);
    }
  };

  const handleBuscarPorFechas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ventas/por-fechas', {
        params: { desde, hasta },
      });
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener ventas por fechas:', error);
    }
  };

  const handleBuscarPorUsuario = async () => {
    if (!usuarioId) {
      alert('Ingresa un ID de usuario válido');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/ventas/por-usuario/${usuarioId}`);
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener ventas por usuario:', error);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />
      <h2>Ventas</h2>

      <div className={styles.filtro}>
        <label>
          Desde:
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label>
          Hasta:
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </label>
        <button onClick={handleBuscarPorFechas}>Buscar por Fechas</button>
      </div>

      <div className={styles.filtro}>
        <label>
          ID de Usuario:
          <input
            type="text"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            placeholder="Ej: 6623f..."
          />
        </label>
        <button onClick={handleBuscarPorUsuario}>Buscar por Usuario</button>
      </div>

      <div style={{ margin: '15px 0' }}>
        <button onClick={obtenerTodasLasVentas}>Ver Todas</button>
      </div>

      {Array.isArray(ventas) && ventas.length > 0 ? (
        <ul className={styles.ventasList}>
          {ventas.map((venta) => (
            <li key={venta._id}>
              <strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()}<br />
              <strong>Total:</strong> {venta.total} Bs<br />
              <strong>Usuario:</strong> {venta.usuarioId}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: '20px' }}>No hay ventas para mostrar.</p>
      )}
    </div>
  );
};

export default AdminVentas;
