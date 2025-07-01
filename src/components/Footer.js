import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; {new Date().getFullYear()} Tienda Textil Copacabana — Todos los derechos reservados.</p>
        <p className={styles.subText}>
          Desarrollado por textilescopacabana | El Alto, Bolivia
        </p>
      </div>
    </footer>
  );
};

export default Footer;
