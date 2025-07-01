import { useState, useRef, useEffect } from 'react';
import styles from '../styles/AISidebar.module.css';
import { consultarIA } from '../utils/api';

const AISidebar = ({ isOpen, onClose, onFiltrarIA, toggleSidebar }) => {
  const [solicitud, setSolicitud] = useState('');
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const historialRef = useRef(null);

  const manejarBusqueda = async () => {
    if (!solicitud.trim()) {
      setError('Escribe qué productos buscas.');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const data = await consultarIA(solicitud);
      const horaActual = new Date().toLocaleTimeString();

      let mensajeIA;
      if (data.recomendados.length === 0) {
        mensajeIA = 'No se encontraron productos sugeridos.';
      } else {
        mensajeIA = data.recomendados
          .map(p => `• ${p.nombre} - ${p.precio} Bs (${p.categoria})`)
          .join('\n');
      }

      const nuevaEntrada = {
        pregunta: solicitud,
        respuesta: mensajeIA,
        hora: horaActual,
      };

      setHistorial(prev => [...prev, nuevaEntrada]);
      onFiltrarIA(data.recomendados);
      setSolicitud('');
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al consultar la IA.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (historialRef.current) {
      historialRef.current.scrollTop = historialRef.current.scrollHeight;
    }
  }, [historial]);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Botón dentro del sidebar cuando está abierto */}
      {isOpen && (
        <button className={styles.closeButton} onClick={toggleSidebar}>
          Cerrar IA
        </button>
      )}

      <h2>Filtro Inteligente 🤖</h2>

      <textarea
        placeholder="Describe qué productos buscas o consulta a la IA..."
        value={solicitud}
        onChange={(e) => setSolicitud(e.target.value)}
      />

      <button onClick={manejarBusqueda}>
        {cargando ? 'Buscando...' : 'Buscar con IA'}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.historial} ref={historialRef}>
        {historial.map((item, index) => (
          <div key={index} className={styles.chatItem}>
            <p><strong>📥 Tú ({item.hora}):</strong> {item.pregunta}</p>
            <p><strong>🤖 IA:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{item.respuesta}</pre>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISidebar;
