import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';
import { obtenerCarrito } from '../utils/carritoApi';
import { safeGetItem, safeRemoveItem } from '../utils/storage';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = safeGetItem('token');
      setIsLoggedIn(!!token);

      if (token) {
        obtenerCarrito()
          .then(data => {
            const totalItems = data.productos.reduce((sum, item) => sum + item.cantidad, 0);
            setCartCount(totalItems);
          })
          .catch(() => setCartCount(0));
      } else {
        setCartCount(0);
      }
    };

    checkAuth();
    router.events.on('routeChangeComplete', checkAuth);
    return () => {
      router.events.off('routeChangeComplete', checkAuth);
    };
  }, [router]);

  const handleLogout = () => {
    safeRemoveItem('token');
    safeRemoveItem('user');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const isActive = (path) => (router.pathname === path ? styles.activeLink : '');

  if (
    router.pathname.includes('/login') ||
    router.pathname.includes('/signup') ||
    router.pathname.includes('/forgot-password') ||
    router.pathname.includes('/reset-password')
  ) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Textiles Copacabana</div>

      <button
        data-testid="menu-button"
        className={`${styles.menuButton} ${menuOpen ? styles.open : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
        <li>
          <Link href="/" className={isActive('/')} data-testid="link-inicio">Inicio</Link>
        </li>
        <li>
          <Link href="/catalog" className={isActive('/catalog')} data-testid="link-catalogo">Catálogo</Link>
        </li>
        <li>
          <Link href="/cart" className={isActive('/cart')} data-testid="link-carrito">
            Carrito {cartCount > 0 && `(${cartCount})`}
          </Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link href="/mis-compras" className={isActive('/mis-compras')} data-testid="link-miscompras">Mis Compras</Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button onClick={handleLogout} className={styles.logoutButton} data-testid="btn-logout">
              Cerrar Sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
