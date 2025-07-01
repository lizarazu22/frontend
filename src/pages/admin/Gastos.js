import { useState, useEffect } from 'react';
import API from '../../utils/api';
import AdminNavbar from '../../components/AdminNavbar';
import withAuth from '../../middlewares/withAuth';
import MUIDataTable from "mui-datatables";
import { Box, Typography, TextField, Button } from '@mui/material';

const GastosAdmin = () => {
  const [gastos, setGastos] = useState([]);
  const [nuevoGasto, setNuevoGasto] = useState({
    descripcion: '',
    monto: '',
    fecha: '',
  });

  useEffect(() => {
    obtenerUltimosGastos();
  }, []);

  const obtenerUltimosGastos = async () => {
    try {
      const res = await API.get('/gastos');
      const ordenados = res.data
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 10);
      setGastos(ordenados);
    } catch (err) {
      console.error('Error obteniendo gastos:', err);
    }
  };

  const handleAgregarGasto = async (e) => {
    e.preventDefault();
    if (!nuevoGasto.descripcion || !nuevoGasto.monto) {
      alert('Descripción y monto son obligatorios.');
      return;
    }
    try {
      await API.post('/gastos', nuevoGasto);
      setNuevoGasto({ descripcion: '', monto: '', fecha: '' });
      obtenerUltimosGastos();
    } catch (err) {
      console.error('Error agregando gasto:', err);
    }
  };

  const columns = [
    {
      name: "fecha",
      label: "Fecha",
      options: {
        customBodyRender: (value) => new Date(value).toLocaleDateString()
      }
    },
    { name: "descripcion", label: "Descripción" },
    {
      name: "monto",
      label: "Monto (Bs)",
      options: {
        customBodyRender: (value) => `${value.toFixed(2)}`
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
        noMatch: "No hay gastos disponibles",
        toolTip: "Ordenar",
      },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Mostrar columnas",
        filterTable: "Filtrar tabla",
      },
      filter: {
        all: "Todos",
        title: "Filtros",
        reset: "Limpiar",
      },
      viewColumns: {
        title: "Mostrar Columnas",
        titleAria: "Mostrar/Ocultar Columnas",
      },
      selectedRows: {
        text: "fila(s) seleccionada(s)",
        delete: "Eliminar",
        deleteAria: "Eliminar filas seleccionadas",
      },
    },
    setRowProps: () => ({ style: { backgroundColor: "#f9f9f9" } }),
    setTableProps: () => ({ style: { borderRadius: '12px', overflow: 'hidden' } })
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1150px', margin: '0 auto' }}>
      <AdminNavbar />
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>📒 Gastos</Typography>

      <MUIDataTable
        title={"📑 Gastos recientes"}
        data={gastos}
        columns={columns}
        options={options}
      />

      <Typography variant="h5" sx={{ mt: 5, mb: 2, fontWeight: 700 }}>➕ Agregar Nuevo Gasto</Typography>

      <Box component="form" onSubmit={handleAgregarGasto} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <TextField
          label="Descripción"
          value={nuevoGasto.descripcion}
          onChange={(e) => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })}
        />
        <TextField
          label="Monto"
          type="number"
          value={nuevoGasto.monto}
          inputProps={{ min: 0, step: 0.5 }}
          onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
        />
        <TextField
          label="Fecha"
          type="date"
          value={nuevoGasto.fecha}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setNuevoGasto({ ...nuevoGasto, fecha: e.target.value })}
        />
        <Button variant="contained" type="submit" sx={{ py: 1.5, px: 3, fontWeight: 600 }}>
          Agregar Gasto
        </Button>
      </Box>
    </div>
  );
};

export default withAuth(GastosAdmin, ['admin']);
