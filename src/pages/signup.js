import { useState } from 'react';
import { signupUser } from '../utils/api';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const Signup = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await signupUser(nombre, email, password);
      setMensaje('Registro exitoso, redirigiendo al login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Registrarse</h1>
        <div>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            data-testid="signup-nombre"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="signup-email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="signup-password"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        <button
          type="submit"
          className={styles.loginButton}
          data-testid="signup-submit"
        >
          Registrarse
        </button>
        <button
          type="button"
          className={styles.registerButton}
          onClick={() => router.push('/login')}
        >
          Volver al Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
