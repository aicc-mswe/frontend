import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRecommendation, uploadPDF } from '../../services/api';
import styles from './AppPage.module.css';

function AppPage() {
  const navigate = useNavigate();
  const [selectedCardTypes, setSelectedCardTypes] = useState([]);
  const [selectedRewardTypes, setSelectedRewardTypes] = useState([]);
  const [annualFeeRange, setAnnualFeeRange] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [otherDescription, setOtherDescription] = useState('');
  const [activeMenu, setActiveMenu] = useState('recommend');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        return;
      }
      
      setUploadedFile(file);
      setError(null);
      setIsUploading(true);
      
      try {
        console.log('Uploading PDF:', file.name);
        const result = await uploadPDF(file);
        console.log('PDF upload result:', result);
        
        // Backend returns fileId inside data object: { success, message, data: { fileId, ... } }
        // Check for fileId in data object first, then fall back to root level
        const fileId = result.data?.fileId || result.fileId || result.id || result.file_id || result.uuid;
        
        if (!fileId) {
          console.error('No fileId found in response:', result);
          throw new Error('Backend did not return a fileId. Response: ' + JSON.stringify(result));
        }
        
        setUploadedFileId(fileId);
        console.log('File uploaded successfully with ID:', fileId);
      } catch (err) {
        console.error('Failed to upload PDF:', err);
        setError(`Failed to upload PDF: ${err.message}`);
        setUploadedFile(null);
        setUploadedFileId(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleGenerateRecommendation = async () => {
    // Clear previous errors
    setError(null);
    
    // Validate at least some input
    if (selectedCardTypes.length === 0 && 
        selectedRewardTypes.length === 0 && 
        !annualFeeRange && 
        !uploadedFileId && 
        !otherDescription.trim()) {
      setError('Please select at least one preference or provide additional requirements.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare API request data
      const requestData = {
        cardTypes: selectedCardTypes,
        rewardTypes: selectedRewardTypes,
        annualFeeRange: annualFeeRange,
        fileId: uploadedFileId, // Use fileId instead of file
        additionalRequirements: otherDescription
      };

      console.log('=== Generating Recommendation ===');
      console.log('Sending recommendation request with data:', {
        cardTypes: selectedCardTypes,
        rewardTypes: selectedRewardTypes,
        annualFeeRange,
        fileId: uploadedFileId,
        additionalRequirements: otherDescription
      });
      console.log('uploadedFileId state value:', uploadedFileId);
      console.log('uploadedFileId type:', typeof uploadedFileId);
      console.log('requestData.fileId:', requestData.fileId);

      // Submit job to API
      const result = await generateRecommendation(requestData);
      
      console.log('Job submission result:', result);
      console.log('=== End Generating Recommendation ===');
      
      // Check if we got a jobId (async mode) or direct data (sync mode)
      if (result.jobId) {
        // Async mode: Navigate to results page with jobId for polling
        navigate('/results', { 
          state: { 
            jobId: result.jobId,
            requestFilters: requestData,
            isProcessing: true
          } 
        });
      } else if (result.data) {
        // Sync mode (backward compatible): Navigate with direct data
        navigate('/results', { 
          state: { 
            recommendationData: result,
            requestFilters: requestData,
            isProcessing: false
          } 
        });
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Failed to generate recommendation:', err);
      setError(err.message || 'Failed to generate recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

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
          <h3>Upload Statement (PDF)</h3>
          <p className={styles.helperText}>Upload your credit card statement PDF to get personalized recommendations</p>
          <div className={styles.fileUploadWrapper}>
            <input
              type="file"
              id="file-upload"
              className={styles.fileInput}
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className={styles.fileUploadBtn}>
              {isUploading ? (
                <>
                  <span className={styles.spinner}></span>
                  Uploading...
                </>
              ) : uploadedFile ? (
                <>
                  ✓ {uploadedFile.name}
                </>
              ) : (
                'Choose PDF File'
              )}
            </label>
            {uploadedFileId && (
              <span className={styles.fileIdIndicator}>
                File ID: {uploadedFileId.substring(0, 8)}...
              </span>
            )}
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
        <button 
          className={styles.generateBtn} 
          onClick={handleGenerateRecommendation}
          disabled={isLoading || isUploading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Generating...
            </>
          ) : (
            'Generate Recommendation'
          )}
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
