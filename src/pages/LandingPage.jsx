import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">AICC</div>
          <ul className="nav-links">
            <li><a onClick={() => handleNavigation('/about')}>About</a></li>
            <li><a onClick={() => handleNavigation('/team')}>Team</a></li>
            <li><a onClick={() => handleNavigation('/contact')}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>AI-Powered Credit Card Recommendations</h1>
          <p>Find the perfect credit card tailored to your spending habits and lifestyle</p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
