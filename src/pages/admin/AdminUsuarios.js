import { useEffect, useState } from 'react';
import API from '../../utils/api';
import styles from '../../styles/AdminUsuarios.module.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await API.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleUsuarioClick = async (usuarioId) => {
    try {
      const response = await API.get(`/ventas/por-usuario/${usuarioId}`);
      setVentas(response.data);
      const usuario = usuarios.find((u) => u._id === usuarioId);
      setUsuarioSeleccionado(usuario);
    } catch (error) {
      console.error('Error al obtener ventas del usuario:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Usuarios</h2>
      <ul className={styles.usuarioList}>
        {usuarios.map((usuario) => (
          <li key={usuario._id} onClick={() => handleUsuarioClick(usuario._id)}>
            {usuario.nombre} ({usuario.email})
          </li>
        ))}
      </ul>
      {usuarioSeleccionado && (
        <div className={styles.ventasContainer}>
          <h3>Ventas de {usuarioSeleccionado.nombre}</h3>
          <ul>
            {ventas.map((venta) => (
              <li key={venta._id}>
                Fecha: {new Date(venta.fecha).toLocaleDateString()} - Total: {venta.total.toFixed(2)} Bs
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
