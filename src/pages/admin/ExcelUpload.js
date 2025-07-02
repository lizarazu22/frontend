import { useState } from 'react';
import API from '@/utils/api';
import withAuth from '../../middlewares/withAuth';
import AdminNavbar from '../../components/AdminNavbar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Typography, Alert, CircularProgress, Paper } from '@mui/material';

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('⚠️ Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setSubiendo(true);

    try {
      const response = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('❌ Error al subir el archivo.');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div style={{ padding: '30px 20px' }}>
      <AdminNavbar />
      <Box
        sx={{
          maxWidth: 480,
          margin: '40px auto',
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: '#fff',
          textAlign: 'center'
        }}
        component={Paper}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          📤 Subir Archivo Excel
        </Typography>

        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            marginBottom: '20px',
            width: '100%'
          }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={handleUpload}
          disabled={subiendo}
          sx={{ py: 1.5, px: 3, fontWeight: 600, fontSize: '1rem' }}
        >
          {subiendo ? <CircularProgress size={22} color="inherit" /> : 'Subir Archivo'}
        </Button>

        {message && (
          <Alert
            severity={message.includes('Error') || message.includes('❌') ? 'error' : 'success'}
            sx={{ mt: 3 }}
          >
            {message}
          </Alert>
        )}
      </Box>
    </div>
  );
};

export default withAuth(ExcelUpload, ['admin']);
