import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Login.module.css';
import { safeSetItem } from '../utils/storage';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Credenciales incorrectas.');

      const data = await response.json();

      safeSetItem('token', data.token, rememberMe);
      safeSetItem('user', data.user, rememberMe);

      router.push(data.user.rol === 'admin' ? '/admin/Usuarios' : '/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.avatar}></div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          data-testid="login-email"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          data-testid="login-password"
          required
        />

        <div className={styles.options}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />{' '}
            Recordarme
          </label>

          <Link href={`/forgot-password?email=${encodeURIComponent(form.email)}`}>
            <span className={styles.forgotLink} data-testid="forgot-password-link">
              ¿Olvidaste tu contraseña?
            </span>
          </Link>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.loginButton}
          data-testid="login-submit"
        >
          Iniciar sesión
        </button>

        <button
          type="button"
          className={styles.registerButton}
          onClick={() => router.push('/signup')}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Login;
