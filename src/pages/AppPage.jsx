import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppPage.css';

function AppPage() {
  const navigate = useNavigate();
  const [selectedCardTypes, setSelectedCardTypes] = useState([]);
  const [selectedRewardTypes, setSelectedRewardTypes] = useState([]);
  const [annualFeeRange, setAnnualFeeRange] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [otherDescription, setOtherDescription] = useState('');
  const [activeMenu, setActiveMenu] = useState('recommend');

  const cardTypes = ['Any', 'VISA', 'Mastercard', 'American Express', 'Discover'];
  const rewardTypes = ['Any', 'Hotel', 'Flights', 'Cash Back', 'Dining', 'Gas', 'Groceries'];
  const feeRanges = [
    { label: 'Any', value: 'any' },
    { label: '$0 - $100', value: '0-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: '$200 - $300', value: '200-300' },
    { label: '$300+', value: '300+' }
  ];

  const handleCardTypeToggle = (type) => {
    setSelectedCardTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleRewardTypeToggle = (type) => {
    setSelectedRewardTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleGenerateRecommendation = () => {
    console.log({
      cardTypes: selectedCardTypes,
      rewardTypes: selectedRewardTypes,
      annualFeeRange,
      uploadedFile: uploadedFile?.name,
      otherDescription
    });
    // Navigate to results page
    navigate('/results');
  };

  const renderContent = () => {
    if (activeMenu === 'history') {
      return (
        <div className="menu-content">
          <h2>Recommendation History</h2>
          <p className="coming-soon">No recommendation history yet.</p>
        </div>
      );
    }

    if (activeMenu === 'chat') {
      return (
        <div className="menu-content">
          <h2>Chat History</h2>
          <p className="coming-soon">No chat history yet.</p>
        </div>
      );
    }

    return (
      <div className="recommendation-form">
        <h1>Credit Card Recommendation</h1>
        <p className="subtitle">Find your perfect credit card by selecting your preferences</p>

        {/* Card Type Selection */}
        <div className="form-section">
          <h3>Card Type</h3>
          <div className="checkbox-grid">
            {cardTypes.map(type => (
              <label key={type} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedCardTypes.includes(type)}
                  onChange={() => handleCardTypeToggle(type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reward Type Selection */}
        <div className="form-section">
          <h3>Reward Type</h3>
          <div className="checkbox-grid">
            {rewardTypes.map(type => (
              <label key={type} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedRewardTypes.includes(type)}
                  onChange={() => handleRewardTypeToggle(type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Annual Fee Range */}
        <div className="form-section">
          <h3>Annual Fee Range</h3>
          <div className="radio-group">
            {feeRanges.map(range => (
              <label key={range.value} className="radio-item">
                <input
                  type="radio"
                  name="feeRange"
                  value={range.value}
                  checked={annualFeeRange === range.value}
                  onChange={(e) => setAnnualFeeRange(e.target.value)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Statement Upload */}
        <div className="form-section">
          <h3>Upload Statement</h3>
          <p className="helper-text">Upload your credit card statement to get personalized recommendations</p>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="file-upload"
              className="file-input"
              accept=".pdf,.csv,.xlsx"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="file-upload-btn">
              {uploadedFile ? uploadedFile.name : 'Choose File'}
            </label>
          </div>
        </div>

        {/* Other Description */}
        <div className="form-section">
          <h3>Additional Requirements</h3>
          <p className="helper-text">Describe any specific requirements or preferences</p>
          <textarea
            className="description-textarea"
            placeholder="E.g., I travel frequently to Europe, prefer no foreign transaction fees..."
            value={otherDescription}
            onChange={(e) => setOtherDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <button className="generate-btn" onClick={handleGenerateRecommendation}>
          Generate Recommendation
        </button>
      </div>
    );
  };

  return (
    <div className="app-page">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>AICC</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeMenu === 'recommend' ? 'active' : ''}`}
            onClick={() => setActiveMenu('recommend')}
          >
            <span>New Recommendation</span>
          </button>
          <button
            className={`nav-item ${activeMenu === 'history' ? 'active' : ''}`}
            onClick={() => setActiveMenu('history')}
          >
            <span>Recommendation History</span>
          </button>
          <button
            className={`nav-item ${activeMenu === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveMenu('chat')}
          >
            <span>Chat History</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default AppPage;
