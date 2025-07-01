const CartItem = ({ item, onUpdate, onRemove }) => {
    return (
      <div>
        <h3>{item.nombre}</h3>
        <p>Precio: ${item.precio}</p>
        <p>Cantidad:</p>
        <input
          type="number"
          value={item.cantidad}
          onChange={(e) => onUpdate(item._id, e.target.value)}
        />
        <button onClick={() => onRemove(item._id)}>Eliminar</button>
      </div>
    );
  };
  
  export default CartItem;
  