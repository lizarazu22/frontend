import { useState, useEffect } from 'react';
import API from '../../utils/api';
import AdminNavbar from '../../components/AdminNavbar';
import withAuth from '../../middlewares/withAuth';
import styles from '../../styles/AdminUsuarios.module.css';
import MUIDataTable from "mui-datatables";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await API.get('/usuarios');
      const ordenados = res.data.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));
      setUsuarios(ordenados);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalEditar(true);
  };

  const abrirModalEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalEliminar(true);
  };

  const cerrarModales = () => {
    setUsuarioSeleccionado(null);
    setMostrarModalEditar(false);
    setMostrarModalEliminar(false);
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/usuarios/${usuarioSeleccionado._id}`, {
        nombre: usuarioSeleccionado.nombre,
        email: usuarioSeleccionado.email,
        rol: usuarioSeleccionado.rol
      });
      obtenerUsuarios();
      cerrarModales();
    } catch (err) {
      console.error('Error al editar usuario:', err);
    }
  };

  const handleEliminarUsuario = async () => {
    try {
      await API.delete(`/usuarios/${usuarioSeleccionado._id}`);
      obtenerUsuarios();
      cerrarModales();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const handleCambioInput = (e) => {
    const { name, value } = e.target;
    setUsuarioSeleccionado({ ...usuarioSeleccionado, [name]: value });
  };

  const columns = [
    { name: "nombre", label: "Nombre" },
    { name: "email", label: "Email" },
    { name: "rol", label: "Rol" },
    {
      name: "creadoEn",
      label: "Registrado",
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString()
      }
    },
    {
      name: "acciones",
      label: "Acciones",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const user = usuarios[dataIndex];
          return (
            <>
              <button onClick={() => abrirModalEditar(user)} className={styles.editButton}>Editar</button>
              <button onClick={() => abrirModalEliminar(user)} className={styles.deleteButton}>Eliminar</button>
            </>
          );
        }
      }
    }
  ];

  return (
    <div className={styles.adminUsuariosContainer}>
      <AdminNavbar />
      <h1>📋 Usuarios Registrados</h1>

      <MUIDataTable
        title={"Usuarios Registrados"}
        data={usuarios}
        columns={columns}
        options={{
          selectableRows: "none",
          responsive: "standard",
          search: true,
          download: false,
          print: false,
          viewColumns: true,
          filter: true,
          textLabels: {
            body: {
              noMatch: "No hay usuarios disponibles",
              toolTip: "Ordenar",
              columnHeaderTooltip: (column) => `Ordenar por ${column.label}`
            },
            pagination: {
              next: "Siguiente Página",
              previous: "Página Anterior",
              rowsPerPage: "Filas por página:",
              displayRows: "de"
            },
            toolbar: {
              search: "Buscar",
              viewColumns: "Mostrar Columnas",
              filterTable: "Filtrar Tabla"
            },
            filter: {
              all: "Todos",
              title: "FILTROS",
              reset: "REINICIAR"
            },
            viewColumns: {
              title: "Mostrar Columnas",
              titleAria: "Mostrar/Ocultar columnas"
            },
            selectedRows: {
              text: "fila(s) seleccionada(s)",
              delete: "Eliminar",
              deleteAria: "Eliminar filas seleccionadas"
            }
          },
          setRowProps: () => ({
            style: { backgroundColor: "#f9f9f9" }
          }),
          setTableProps: () => ({
            style: { borderRadius: '12px', overflow: 'hidden' }
          })
        }}
      />

      {mostrarModalEditar && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleEditarUsuario}>
              <label>Nombre:
                <input type="text" name="nombre" value={usuarioSeleccionado.nombre} onChange={handleCambioInput} required />
              </label>
              <label>Email:
                <input type="email" name="email" value={usuarioSeleccionado.email} onChange={handleCambioInput} required />
              </label>
              <label>Rol:
                <select name="rol" value={usuarioSeleccionado.rol} onChange={handleCambioInput} required>
                  <option value="admin">Admin</option>
                  <option value="cliente">Cliente</option>
                </select>
              </label>
              <div className={styles.modalAcciones}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={cerrarModales}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarModalEliminar && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de eliminar a <strong>{usuarioSeleccionado.nombre}</strong>?</p>
            <div className={styles.modalAcciones}>
              <button onClick={handleEliminarUsuario}>Eliminar</button>
              <button onClick={cerrarModales}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Usuarios, ['admin']);
