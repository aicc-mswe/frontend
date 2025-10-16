import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AppPage.module.css';

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
    if (activeMenu === 'chat') {
      return (
        <div className={styles.menuContent}>
          <h2>Chat History</h2>
          <p className={styles.comingSoon}>No chat history yet.</p>
        </div>
      );
    }

    return (
      <div className={styles.recommendationForm}>
        <h1>Credit Card Recommendation</h1>
        <p className={styles.subtitle}>Find your perfect credit card by selecting your preferences</p>

        {/* Card Type Selection */}
        <div className={styles.formSection}>
          <h3>Card Type</h3>
          <div className={styles.checkboxGrid}>
            {cardTypes.map(type => (
              <label key={type} className={styles.checkboxItem}>
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
        <div className={styles.formSection}>
          <h3>Reward Type</h3>
          <div className={styles.checkboxGrid}>
            {rewardTypes.map(type => (
              <label key={type} className={styles.checkboxItem}>
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
        <div className={styles.formSection}>
          <h3>Annual Fee Range</h3>
          <div className={styles.radioGroup}>
            {feeRanges.map(range => (
              <label key={range.value} className={styles.radioItem}>
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
        <div className={styles.formSection}>
          <h3>Upload Statement</h3>
          <p className={styles.helperText}>Upload your credit card statement to get personalized recommendations</p>
          <div className={styles.fileUploadWrapper}>
            <input
              type="file"
              id="file-upload"
              className={styles.fileInput}
              accept=".pdf,.csv,.xlsx"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className={styles.fileUploadBtn}>
              {uploadedFile ? uploadedFile.name : 'Choose File'}
            </label>
          </div>
        </div>

        {/* Other Description */}
        <div className={styles.formSection}>
          <h3>Additional Requirements</h3>
          <p className={styles.helperText}>Describe any specific requirements or preferences</p>
          <textarea
            className={styles.descriptionTextarea}
            placeholder="E.g., I travel frequently to Europe, prefer no foreign transaction fees..."
            value={otherDescription}
            onChange={(e) => setOtherDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <button className={styles.generateBtn} onClick={handleGenerateRecommendation}>
          Generate Recommendation
        </button>
      </div>
    );
  };

  return (
    <div className={styles.appPage}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>AICC</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeMenu === 'recommend' ? styles.active : ''}`}
            onClick={() => setActiveMenu('recommend')}
          >
            <span>New Recommendation</span>
          </button>
          <button
            className={styles.navItem}
            onClick={() => navigate('/recommendation-history')}
          >
            <span>Recommendation History</span>
          </button>
          <button
            className={`${styles.navItem} ${activeMenu === 'chat' ? styles.active : ''}`}
            onClick={() => setActiveMenu('chat')}
          >
            <span>Chat History</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
}

export default AppPage;
