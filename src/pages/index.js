import styles from '../styles/Home.module.css';
import withAuth from '../middlewares/withAuth';

const Home = () => {
  return (
    <div>
      <div className={styles.hero}>
        <div>
          <h1>Textiles Copacabana</h1>
          <p>Fabricamos hilos de fibras naturales y sintéticas, con materia prima nacional.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>¿Cómo surge?</h2>
        <p>
          Ante la carencia de una industria que proporcione a nuestros artesanos hilos y telas
          para desarrollar la confección de prendas artesanales, el 20 de agosto de 1995 surge
          Textiles Copacabana. Empresa 100% boliviana, parte del Grupo Pomier, iniciando
          operaciones en 1996 y consolidándose como referente nacional.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Compromiso y Calidad</h2>
        <p>
          Cuidamos minuciosamente la densidad, dirección del giro, resistencia y aspecto del hilo,
          garantizando excelentes tejidos. Nuestro proceso incluye:
        </p>
        <ul className={styles.list}>
          <li><strong>Densidad:</strong> influye en aspecto, peso y propiedades mecánicas del tejido.</li>
          <li><strong>Dirección del giro:</strong> para fuerza, elasticidad, brillo y estructura.</li>
          <li><strong>Resistencia de un solo hilo:</strong> garantiza funcionamiento óptimo en tejido.</li>
          <li><strong>Calidad visual:</strong> detectamos deshilachados, irregularidades y defectos.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Cultura Empresarial</h2>
        <p>
          Creemos en el respeto, trabajo en equipo, honradez, verdad y justicia como valores base
          para nuestra labor textil, y brindar productos con calidad garantizada.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Valores</h2>
        <ul className={styles.list}>
          <li>Ética</li>
          <li>Honestidad</li>
          <li>Respeto</li>
          <li>Verdad</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Algunas Cifras</h2>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <h3>15</h3>
            <p>Reconocimientos</p>
          </div>
          <div className={styles.statItem}>
            <h3>25+</h3>
            <p>Distribuidores</p>
          </div>
          <div className={styles.statItem}>
            <h3>140+</h3>
            <p>Clientes Nacionales</p>
          </div>
          <div className={styles.statItem}>
            <h3>13+</h3>
            <p>Clientes Extranjeros</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Reconocimientos</h2>
        <p>
          🏆 Mejor Empresa Textil 100% Nacional — Premios MAYA 2018<br />
          🏅 Mejor Empresa Textil — Galardón nacional
        </p>
      </div>

      <div className={styles.section}>
        <h2>Contacto</h2>
        <p>📞 (591) 772 45533 | (591) 285 2122 | (591) 246 3580</p>
        <p>📧 <a href="mailto:info@textilescopacabana.com">info@textilescopacabana.com</a> / <a href="mailto:fibrasbolivianas@gmail.com">fibrasbolivianas@gmail.com</a></p>
        <p>📍 <a href="https://www.google.com/maps/place/Calle+Illampu+853,+La+Paz,+Bolivia" target="_blank" rel="noopener noreferrer">Calle Illampu Nro. 853, esquina Sagárnaga, La Paz - Bolivia</a></p>
      </div>
    </div>
  );
};

export default withAuth(Home);
