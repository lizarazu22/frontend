import styles from '../styles/SidebarFilters.module.css';

const SidebarFilters = ({
  filters,
  setFilters,
  categorias = [],
  materiales = [],
  colores = [],
  densidades = [],
  isOpen,
  toggleSidebar
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={toggleSidebar}>
        Cerrar Filtros
      </button>

      <div className={styles.filterGroup}>
        <label htmlFor="category">Categoría</label>
        <select name="category" id="category" onChange={handleChange} value={filters.category}>
          <option value="">Todas</option>
          {categorias.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="material">Material</label>
        <select name="material" id="material" onChange={handleChange} value={filters.material}>
          <option value="">Todos</option>
          {materiales.map((mat, i) => (
            <option key={i} value={mat}>{mat}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="color">Color</label>
        <select name="color" id="color" onChange={handleChange} value={filters.color}>
          <option value="">Todos</option>
          {colores.map((col, i) => (
            <option key={i} value={col}>{col}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="densidad">Densidad</label>
        <select name="densidad" id="densidad" onChange={handleChange} value={filters.densidad}>
          <option value="">Todas</option>
          {densidades.map((den, i) => (
            <option key={i} value={den}>{den}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="price">Precio Máximo</label>
        <input
          type="number"
          name="price"
          id="price"
          value={filters.price || ''}
          onChange={handleChange}
        />
      </div>

      <div className={styles.filterGroup}>
        <label>
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock || false}
            onChange={handleChange}
          />
          Solo productos en stock
        </label>
      </div>

      <div className={styles.filterGroup}>
        <label>
          <input
            type="checkbox"
            name="enOferta"
            checked={filters.enOferta || false}
            onChange={handleChange}
          />
          Solo productos en oferta
        </label>
      </div>

      <div className={styles.filterGroup}>
        <label>
          <input
            type="checkbox"
            name="nuevos"
            checked={filters.nuevos || false}
            onChange={handleChange}
          />
          Solo nuevos ingresos
        </label>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="ordenarPor">Ordenar por</label>
        <select name="ordenarPor" id="ordenarPor" onChange={handleChange} value={filters.ordenarPor || ''}>
          <option value="">--</option>
          <option value="precioAsc">Precio: menor a mayor</option>
          <option value="precioDesc">Precio: mayor a menor</option>
          <option value="nombreAsc">Nombre A-Z</option>
          <option value="nombreDesc">Nombre Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default SidebarFilters;
