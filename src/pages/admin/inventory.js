import { useState, useEffect } from 'react';
import API from '../../utils/api';

const Inventory = () => {
  const [productos, setProductos] = useState([]);
  const [stock, setStock] = useState({});

  useEffect(() => {
    const fetchInventory = async () => {
      const data = await API.get('/productos');
      setProductos(data.data);
    };
    fetchInventory();
  }, []);

  const handleStockChange = (id, value) => {
    setStock({ ...stock, [id]: value });
  };

  const updateStock = async (id) => {
    const newStock = stock[id];
    if (!newStock) return;
    try {
      await API.patch(`/productos/${id}`, { stock: newStock });
      alert('Inventario actualizado');
    } catch (error) {
      alert('Error al actualizar inventario');
    }
  };

  return (
    <div>
      <h1>Gestión de Inventarios</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto._id}>
            <h3>{producto.nombre}</h3>
            <p>Stock actual: {producto.stock}</p>
            <input
              type="number"
              placeholder="Nuevo stock"
              onChange={(e) => handleStockChange(producto._id, e.target.value)}
            />
            <button onClick={() => updateStock(producto._id)}>Actualizar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
