import { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';

const SubirExcel = () => {
  const [archivo, setArchivo] = useState(null);

  const manejarCambio = e => {
    setArchivo(e.target.files[0]);
  };

  const manejarEnvio = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('archivo', archivo);

    fetch('/api/productos/importar', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => alert('Archivo subido correctamente'))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <AdminNavbar />
      <h2>Subir Archivo Excel</h2>
      <form onSubmit={manejarEnvio}>
        <input type="file" accept=".xlsx, .xls" onChange={manejarCambio} />
        <button type="submit">Subir</button>
      </form>
    </div>
  );
};

export default SubirExcel;
