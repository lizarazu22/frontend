import { useState, useEffect } from 'react';
import styles from '../styles/AdminSidebar.module.css';

const AdminSidebar = ({ isOpen, onClose, logs = [] }) => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [emailFiltro, setEmailFiltro] = useState('');
  const [logsFiltrados, setLogsFiltrados] = useState([]);

  const limpiarDatos = (obj) => {
    if (!obj) return null;
    const copia = { ...obj };
    delete copia._id;
    delete copia.password;
    delete copia.__v;
    return copia;
  };

  const renderTablaDatos = (data) => {
    if (!data) return <p>-</p>;
    return (
      <table className={styles.dataTable}>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className={styles.keyCell}>{key}</td>
              <td className={styles.valueCell}>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const filtrarLogs = () => {
    let filtrados = logs;

    if (desde) {
      filtrados = filtrados.filter((log) => new Date(log.fecha) >= new Date(desde));
    }
    if (hasta) {
      filtrados = filtrados.filter((log) => new Date(log.fecha) <= new Date(hasta));
    }
    if (emailFiltro) {
      filtrados = filtrados.filter((log) =>
        log.admin?.email?.toLowerCase().includes(emailFiltro.trim().toLowerCase())
      );
    }

    return filtrados
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 10);
  };

  useEffect(() => {
    if (isOpen) {
      const ultimos = logs
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 10);
      setLogsFiltrados(ultimos);
    }
  }, [logs, isOpen]);

  const handleFiltrar = () => {
    const filtrados = filtrarLogs();
    setLogsFiltrados(filtrados);
  };

  const formatearFecha = (fechaIso) => {
    const fecha = new Date(fechaIso);
    return new Intl.DateTimeFormat('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/La_Paz'
    }).format(fecha);
  };

  return (
    <div className={`${styles.sidebarOverlay} ${isOpen ? styles.show : ''}`}>
      <div className={`${styles.sidebar} ${isOpen ? styles.show : ''}`}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <h2>📊 Reportes de Actividad</h2>

        <div className={styles.filtroFechas}>
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>

        <div className={styles.filtroEmail}>
          <input
            type="text"
            placeholder="Buscar por correo de admin"
            value={emailFiltro}
            onChange={(e) => setEmailFiltro(e.target.value)}
          />
        </div>

        <button className={styles.filtrarButton} onClick={handleFiltrar}>
          🔍 Buscar
        </button>

        {logsFiltrados.length === 0 ? (
          <p>No hay logs registrados.</p>
        ) : (
          <div className={styles.logsContainer}>
            {logsFiltrados.map((log) => (
              <div key={log._id} className={styles.logItem}>
                <strong>
                  {log.accion} — {log.recurso}
                </strong>
                <p><b>Admin:</b> {log.admin?.email || 'Desconocido'}</p>
                <p><b>Previo:</b></p>
                {renderTablaDatos(limpiarDatos(log.datosPrevios))}
                <p><b>Nuevo:</b></p>
                {renderTablaDatos(limpiarDatos(log.datosNuevos))}
                <p className={styles.fecha}>{formatearFecha(log.fecha)}</p>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
