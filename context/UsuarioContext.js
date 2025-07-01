import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  const cargarUsuario = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUsuario(user);
  };

  useEffect(() => {
    cargarUsuario();

    // Sync al cambiar de ruta
    const handleRouteChange = () => {
      cargarUsuario();
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    // Sync si se cambia localStorage desde otra pestaña
    const handleStorageChange = () => {
      cargarUsuario();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => useContext(UsuarioContext);
