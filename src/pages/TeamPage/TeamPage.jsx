import { useNavigate } from 'react-router-dom';
import styles from './TeamPage.module.css';

function TeamPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.infoPage}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo} onClick={() => navigate('/')}>AICC</div>
          <ul className={styles.navLinks}>
            <li><a onClick={() => navigate('/about')}>About</a></li>
            <li><a onClick={() => navigate('/team')}>Team</a></li>
            <li><a onClick={() => navigate('/contact')}>Contact</a></li>
          </ul>
        </div>
      </nav>

      <div className={styles.contentSection}>
        <div className={styles.contentContainer}>
          <h1>Our Team</h1>
          <div className={styles.contentText}>
            <p>
              We are a dedicated team of financial technology experts and AI specialists
              committed to making credit card selection simple and personalized for everyone.
            </p>
            <p>
              Our diverse team brings together expertise in machine learning, financial services,
              and user experience design to create the best recommendation experience.
            </p>
            <p>
              With years of combined experience in fintech and artificial intelligence,
              we're constantly innovating to serve you better.
            </p>
          </div>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
