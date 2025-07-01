import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { UsuarioProvider } from '../../context/UsuarioContext';
import { safeGetItem } from '../utils/storage';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = safeGetItem('user');
    setIsAdmin(user?.rol === 'admin');
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>Sistema de Gestión</title>
      </Head>

      <UsuarioProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {!isAdmin && <Navbar />}
          <div style={{ flex: '1' }}>
            <Component {...pageProps} />
          </div>
          {router.pathname !== '/login' && <Footer />}
        </div>
      </UsuarioProvider>
    </>
  );
}

export default MyApp;
