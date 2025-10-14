import { useNavigate } from 'react-router-dom';
import styles from './ContactPage.module.css';

function ContactPage() {
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
          <h1>Contact Us</h1>
          <div className={styles.contentText}>
            <p>Have questions? We'd love to hear from you.</p>
            
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <h3>Email</h3>
                <p>info@aicc.com</p>
              </div>
              
              <div className={styles.contactItem}>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
              
              <div className={styles.contactItem}>
                <h3>Office Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </div>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
