import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.landingPage}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>AICC</div>
          <ul className={styles.navLinks}>
            <li><a onClick={() => handleNavigation('/about')}>About</a></li>
            <li><a onClick={() => handleNavigation('/team')}>Team</a></li>
            <li><a onClick={() => handleNavigation('/contact')}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>AI-Powered Credit Card Recommendations</h1>
          <p>Find the perfect credit card tailored to your spending habits and lifestyle</p>
          <button className={styles.getStartedBtn} onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
