import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Button, Box, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminNavbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const toggleDrawer = (open) => () => {
    setMenuOpen(open);
  };

  const menuItems = [
    { text: 'Usuarios', link: '/admin/Usuarios' },
    { text: 'Ventas', link: '/admin/Ventas' },
    { text: 'Productos', link: '/admin/Productos' },
    { text: 'Subir Excel', link: '/admin/ExcelUpload' },
    { text: 'Reporte', link: '/admin/Reporte' },
    { text: 'Gastos', link: '/admin/Gastos' },
  ];

  return (
    <>
      <AppBar position="sticky" sx={{
        background: 'linear-gradient(135deg, #0a66c2, #084c9e)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)'
      }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 1 }}>
            📊 Admin Panel
          </Typography>

          {/* Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                href={item.link}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': { color: '#ffd700' }
                }}
              >
                {item.text}
              </Button>
            ))}

            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                background: 'linear-gradient(135deg, #ff5252, #ff0000)',
                color: 'white',
                fontWeight: 600,
                ml: 1,
                '&:hover': {
                  background: '#d80000'
                }
              }}
            >
              Cerrar sesión
            </Button>
          </Box>

          {/* Mobile */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="right" open={menuOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 260, background: '#0a66c2', height: '100%', color: 'white' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ p: 2, fontWeight: 800, borderBottom: '1px solid #ffffff33' }}>
            📊 Menú Admin
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} component={Link} href={item.link}>
                <ListItemText primary={item.text} sx={{ fontWeight: 600 }} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ borderColor: '#ffffff33' }} />
          <List>
            <ListItem button onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              <ListItemText
                primary="Cerrar sesión"
                sx={{ color: 'white', fontWeight: 600 }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default AdminNavbar;
