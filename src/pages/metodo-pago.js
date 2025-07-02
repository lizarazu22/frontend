import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { obtenerCarrito, vaciarCarrito } from '../utils/carritoApi';
import styles from '../styles/PaymentOptions.module.css';
import { safeGetItem } from '../utils/storage';

const MetodoPago = () => {
  const [carrito, setCarrito] = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const usuario = safeGetItem('user');
    if (!usuario || !usuario._id) {
      router.push('/login');
      return;
    }
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      const data = await obtenerCarrito();
      setCarrito(data);
    } catch (error) {
      console.error('Error cargando carrito:', error);
    }
  };

  const completarCompra = async () => {
    const usuario = safeGetItem('user');
    const token = safeGetItem('token');

    if (!usuario || !usuario._id || !carrito || !carrito.productos.length) {
      alert('Debes iniciar sesión y tener productos en el carrito.');
      return;
    }

    if (!comprobante) {
      alert('Debes subir una imagen de comprobante antes de completar la compra.');
      return;
    }

    const formData = new FormData();
    formData.append('usuarioId', usuario._id);
    formData.append('productos', JSON.stringify(carrito.productos));
    formData.append('comprobante', comprobante);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ventas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert('Compra completada correctamente.');
        await vaciarCarrito();
        router.push('/mis-compras');
      } else {
        alert(data.message || 'Error al completar compra');
      }
    } catch (error) {
      console.error('Error completando compra:', error);
      alert('Hubo un problema al completar la compra.');
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <h1>Opciones de Pago</h1>
      <p>Selecciona el método de pago que prefieras:</p>

      <div className={styles.paymentMethods}>
        <div className={styles.paymentOption}>
          <h2>Pago con QR</h2>
          <img src="/images/qr-code.png" alt="Código QR" />
        </div>

        <div className={styles.paymentOption}>
          <h2>Depósito Bancario</h2>
          <ul>
            <li>Banco: Banco Ejemplo</li>
            <li>Cuenta: 1234567890</li>
            <li>Nombre: Ignacio Lizarazu</li>
          </ul>
        </div>
      </div>

      <div className={styles.comprobanteSection}>
        <h3>Sube tu comprobante de pago:</h3>
        <input type="file" accept="image/*" onChange={(e) => setComprobante(e.target.files[0])} />
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={completarCompra} className={styles.completePurchaseButton}>
          Completar Compra
        </button>
      </div>
    </div>
  );
};

export default MetodoPago;
