import { useEffect, useState } from 'react';
import API from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await API.get('/orders');
        setOrders(data.data);
      } catch (error) {
        alert('Error al cargar órdenes');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Órdenes de Compra</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <h3>Orden #{order._id}</h3>
            <p>Fecha: {new Date(order.fecha).toLocaleDateString()}</p>
            <p>Total: ${order.total}</p>
            <ul>
              {order.productos.map((producto) => (
                <li key={producto._id}>
                  {producto.nombre} - Cantidad: {producto.cantidad}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
