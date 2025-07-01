import { useState } from 'react';
import styles from '../styles/BuscarMaterial.module.css';

const BuscarMaterial = () => {
  const [solicitud, setSolicitud] = useState('');
  const [sugerencias, setSugerencias] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setSolicitud(e.target.value);
  };

  const handleBuscar = async () => {
    if (!solicitud) {
      setError('Por favor, ingresa una solicitud.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/gpt/buscar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solicitud }),
      });

      if (!response.ok) {
        throw new Error('No se pudo procesar la solicitud.');
      }

      const data = await response.json();
      setSugerencias(data.sugerencias);
      setError('');
    } catch (err) {
      setError(err.message);
      setSugerencias('');
    }
  };

  return (
    <div className={styles.buscarContainer}>
      <h2>Buscar Material</h2>
      <textarea
        placeholder="Describe lo que necesitas..."
        value={solicitud}
        onChange={handleChange}
        className={styles.textarea}
      ></textarea>
      <button onClick={handleBuscar} className={styles.buscarButton}>
        Buscar
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {sugerencias && (
        <div className={styles.resultados}>
          <h3>Materiales sugeridos:</h3>
          <p>{sugerencias}</p>
        </div>
      )}
    </div>
  );
};

export default BuscarMaterial;
