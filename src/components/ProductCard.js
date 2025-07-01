const ProductCard = ({ producto }) => {
    return (
      <div>
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <p>Precio: ${producto.precio}</p>
      </div>
    );
  };
  
  export default ProductCard;
  