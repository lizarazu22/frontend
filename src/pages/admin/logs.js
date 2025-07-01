import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import styles from '../../styles/logs.module.css';

const LogsAdmin = () => {
  const [logs, setLogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const obtenerLogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Error al cargar logs:', err);
      }
    };
    obtenerLogs();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <button onClick={() => setSidebarOpen(true)} style={{ marginBottom: '20px' }}>
        📋 Menú Admin
      </button>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <h2 className={styles.heading}>Logs de Actividad</h2>

      {logs.length === 0 ? (
        <p>No hay logs registrados.</p>
      ) : (
        logs.map((log) => (
          <div key={log._id} className={styles.logItem}>
            <strong>{log.accion} — {log.recurso}</strong>
            <p>Admin: {log.admin?.nombre || 'Desconocido'}</p>
            <p>Datos previos: {JSON.stringify(log.datosPrevios)}</p>
            <p>Datos nuevos: {JSON.stringify(log.datosNuevos)}</p>
            <p className={styles.fecha}>{new Date(log.fecha).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default LogsAdmin;
