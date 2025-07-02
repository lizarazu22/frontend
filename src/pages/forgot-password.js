import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = router.query.email;
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push('/login');
    }
  }, [router.query]);

  const handleSendEmail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('No se pudo enviar el correo.');

      alert(`Se ha enviado un correo de recuperación a ${email} si existe en nuestra base de datos.`);
      router.push('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1>Recuperar Contraseña</h1>
      <p>Se enviará un correo de recuperación a: <strong>{email}</strong></p>

      <button
        onClick={handleSendEmail}
        data-testid="send-recovery-email"
        style={{ marginTop: '20px', padding: '10px 20px', marginBottom: '12px' }}
      >
        Enviar Correo de Recuperación
      </button>

      <br />

      <button
        onClick={() => router.push('/login')}
        data-testid="back-to-login"
        style={{
          padding: '10px 20px',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Volver al Login
      </button>
    </div>
  );
};

export default ForgotPassword;
