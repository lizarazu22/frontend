import { useState, useEffect } from 'react';
import API from '../../utils/api';
import AdminNavbar from '../../components/AdminNavbar';
import styles from '../../styles/AdminVentas.module.css';
import MUIDataTable from "mui-datatables";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = () => {
    API.get('/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error('Error cargando ventas:', err));
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await API.put(`/ventas/${id}/estado`, { estado: nuevoEstado });
      if (res.status === 200) {
        cargarVentas();
        alert(res.data.message);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error actualizando estado.');
    }
  };

  const columns = [
    {
      name: "fecha",
      label: "Fecha",
      options: {
        customBodyRender: (value) => new Date(value).toLocaleString()
      }
    },
    {
      name: "total",
      label: "Total",
      options: {
        customBodyRender: (value) => `${value.toFixed(2)} Bs`
      }
    },
    {
      name: "productos",
      label: "Productos",
      options: {
        filter: false,
        customBodyRender: (productos) => (
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {productos.map((p, i) => (
              <li key={i}>{p.nombre} — {p.cantidad} u. — {p.precio} Bs</li>
            ))}
          </ul>
        )
      }
    },
    {
      name: "comprobante",
      label: "Comprobante",
      options: {
        filter: false,
        customBodyRender: (url) =>
          url ? <a href={url} target="_blank" rel="noopener noreferrer">Ver</a> : 'No adjunto'
      }
    },
    {
      name: "estado",
      label: "Estado",
      options: {
        customBodyRender: (estado) => {
          let color = 'orange';
          if (estado === 'confirmado') color = 'green';
          if (estado === 'rechazado') color = 'red';
          const estadoTexto = estado === 'standby' ? 'En espera' : estado;
          return <strong style={{ color }}>{estadoTexto}</strong>;
        }
      }
    },
    {
      name: "acciones",
      label: "Acciones",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const venta = ventas[dataIndex];
          return venta.estado === 'standby' ? (
            <>
              <button className={styles.acceptButton} onClick={() => cambiarEstado(venta._id, 'confirmado')}>Aceptar</button>
              <button className={styles.rejectButton} onClick={() => cambiarEstado(venta._id, 'rechazado')}>Rechazar</button>
            </>
          ) : <em>Sin acciones</em>;
        }
      }
    }
  ];

  const options = {
    selectableRows: "none",
    responsive: "standard",
    search: true,
    download: false,
    print: false,
    viewColumns: true,
    filter: true,
    textLabels: {
      body: {
        noMatch: "No hay ventas disponibles",
        toolTip: "Ordenar",
      },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de"
      },
      toolbar: {
        search: "Buscar",
        viewColumns: "Mostrar columnas",
        filterTable: "Filtrar tabla"
      },
      filter: {
        all: "Todos",
        title: "FILTROS",
        reset: "REINICIAR"
      },
      viewColumns: {
        title: "Mostrar columnas",
        titleAria: "Mostrar/Ocultar columnas"
      },
      selectedRows: {
        text: "fila(s) seleccionada(s)",
        delete: "Eliminar",
        deleteAria: "Eliminar filas seleccionadas"
      }
    },
    setRowProps: () => ({ style: { backgroundColor: "#f9f9f9" } }),
    setTableProps: () => ({ style: { borderRadius: '12px', overflow: 'hidden' } })
  };

  return (
    <div className={styles.adminVentasContainer}>
      <AdminNavbar />
      <h2>📊 Reporte de Ventas</h2>

      <MUIDataTable
        title={"Ventas registradas"}
        data={ventas}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default Ventas;
