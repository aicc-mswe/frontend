import { useNavigate } from 'react-router-dom';
import './InfoPage.css';

function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate('/')}>AICC</div>
          <ul className="nav-links">
            <li><a onClick={() => navigate('/about')}>About</a></li>
            <li><a onClick={() => navigate('/team')}>Team</a></li>
            <li><a onClick={() => navigate('/contact')}>Contact</a></li>
          </ul>
        </div>
      </nav>

      <div className="content-section">
        <div className="content-container">
          <h1>Contact Us</h1>
          <div className="content-text">
            <p>Have questions? We'd love to hear from you.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <h3>Email</h3>
                <p>info@aicc.com</p>
              </div>
              
              <div className="contact-item">
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
              
              <div className="contact-item">
                <h3>Office Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </div>
          <button className="back-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
