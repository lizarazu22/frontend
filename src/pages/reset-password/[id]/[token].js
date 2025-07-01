import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../styles/ResetPassword.module.css';

const ResetPasswordTokenPage = () => {
  const router = useRouter();
  const { id, token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMensaje('❌ Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/reset-password/reset-password/${id}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje('✅ Contraseña actualizada correctamente. Redirigiendo al login...');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setMensaje(data.message || '❌ Error al restablecer contraseña.');
      }
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al procesar la solicitud.');
    }
  };

  return (
    <div className={styles.resetContainer}>
      <h2>🔒 Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Guardar</button>
      </form>
      {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
    </div>
  );
};

export default ResetPasswordTokenPage;
