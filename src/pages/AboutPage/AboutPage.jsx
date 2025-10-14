import { useNavigate } from 'react-router-dom';
import styles from './AboutPage.module.css';

function AboutPage() {
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
          <h1>About AICC</h1>
          <div className={styles.contentText}>
            <p>
              AICC is an intelligent credit card recommendation system that uses advanced AI algorithms
              to analyze your spending patterns and preferences.
            </p>
            <p>
              We help you discover the credit cards that offer the best rewards, benefits, and features
              matched to your unique lifestyle.
            </p>
            <p>
              Our mission is to simplify the complex world of credit cards and empower consumers
              to make informed financial decisions.
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

export default AboutPage;
