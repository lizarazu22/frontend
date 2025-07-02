import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/MisCompras.module.css';
import { safeGetItem } from '../utils/storage';

const MisCompras = () => {
  const [compras, setCompras] = useState([]);
  const [verTodas, setVerTodas] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = safeGetItem('user');
    const token = safeGetItem('token');

    if (!user || !user._id || !token) {
      router.push('/login');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas/por-usuario/${user._id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // ordenar de más reciente a más antigua
          const ordenadas = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          setCompras(ordenadas);
        } else {
          setCompras([]);
        }
      })
      .catch(err => {
        console.error('Error cargando compras:', err);
        setCompras([]);
      });
  }, []);

  const comprasAMostrar = verTodas ? compras : compras.slice(0, 3);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🛍️ Mis Compras</h1>

      {Array.isArray(compras) && compras.length === 0 ? (
        <p className={styles.emptyMessage}>No realizaste compras todavía.</p>
      ) : (
        comprasAMostrar.map((venta, idx) => (
          <div key={idx} className={styles.compraCard}>
            <div className={styles.cardHeader}>
              <h3>🧾 Compra del <strong>{new Date(venta.fecha).toLocaleString()}</strong></h3>
              <span className={`${styles.estado} ${styles[venta.estado]}`}>
                {venta.estado === 'confirmado' ? '✅ Confirmado' :
                  venta.estado === 'rechazado' ? '❌ Rechazado' : '🟡 Pendiente'}
              </span>
            </div>

            <ul className={styles.productList}>
              {venta.productos.map((p, i) => (
                <li key={i}>
                  <strong>{p.nombre}</strong> — {p.cantidad} u. — {p.precio.toFixed(2)} Bs
                </li>
              ))}
            </ul>

            <div className={styles.cardFooter}>
              <div>
                📦 <strong>{venta.productos.length}</strong> producto(s)
              </div>
              <div className={styles.total}>
                💵 Total: <strong>{venta.total.toFixed(2)} Bs</strong>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Botón para mostrar más */}
      {compras.length > 3 && !verTodas && (
        <div className={styles.verMas}>
          <button onClick={() => setVerTodas(true)}>Mostrar historial completo</button>
        </div>
      )}

      <div className={styles.actionButtons}>
        <button onClick={() => router.push('/cart')}>Volver al Carrito</button>
        <button onClick={() => router.push('/catalog')}>Ir al Catálogo</button>
      </div>
    </div>
  );
};

export default MisCompras;
