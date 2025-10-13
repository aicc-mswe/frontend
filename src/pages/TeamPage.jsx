import { useNavigate } from 'react-router-dom';
import './InfoPage.css';

function TeamPage() {
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
          <h1>Our Team</h1>
          <div className="content-text">
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
          <button className="back-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
