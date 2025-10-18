import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkRecommendationStatus } from '../../services/api';
import styles from './RecommendationResultPage.module.css';

function RecommendationResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [isProcessing, setIsProcessing] = useState(location?.state?.isProcessing || false);
  const [recommendationData, setRecommendationData] = useState(null);
  const [error, setError] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  // Get jobId or direct data from location state
  const jobId = location?.state?.jobId;
  const directData = location?.state?.recommendationData;

  // Polling logic
  useEffect(() => {
    // If we have direct data (sync mode), use it immediately
    if (directData) {
      setRecommendationData(directData);
      setIsProcessing(false);
      return;
    }

    // If we don't have a jobId, something went wrong
    if (!jobId) {
      setError('No job ID provided. Please try generating recommendations again.');
      setIsProcessing(false);
      return;
    }

    // Start polling for job status
    let pollInterval;
    let timeoutId;

    const pollJobStatus = async () => {
      try {
        console.log(`Polling job status (attempt ${pollCount + 1})...`);
        const result = await checkRecommendationStatus(jobId);
        
        console.log('Poll result:', result);

        if (result.status === 'completed' || result.success) {
          // Job completed successfully
          setRecommendationData(result);
          setIsProcessing(false);
          clearInterval(pollInterval);
          clearTimeout(timeoutId);
          console.log('Job completed successfully');
        } else if (result.status === 'failed' || result.error) {
          // Job failed
          setError(result.error || result.message || 'Failed to generate recommendations');
          setIsProcessing(false);
          clearInterval(pollInterval);
          clearTimeout(timeoutId);
          console.error('Job failed:', result.error);
        } else if (result.status === 'processing') {
          // Still processing, continue polling
          setPollCount(prev => prev + 1);
        }
      } catch (err) {
        console.error('Error polling job status:', err);
        // Don't set error on individual poll failures, keep trying
        setPollCount(prev => prev + 1);
      }
    };

    // Initial poll
    pollJobStatus();

    // Set up interval for subsequent polls (every 3 seconds)
    pollInterval = setInterval(pollJobStatus, 3000);

    // Set timeout to stop polling after 2 minutes
    timeoutId = setTimeout(() => {
      clearInterval(pollInterval);
      if (isProcessing) {
        setError('Request timeout. The process is taking longer than expected. Please try again.');
        setIsProcessing(false);
      }
    }, 120000); // 2 minutes

    // Cleanup on unmount
    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
    };
  }, [jobId, directData]);

  // Extract data from API response structure
  const apiData = recommendationData?.data;
  
  // Use API returned card data from recommendations array
  const recommendedCards = apiData?.recommendations || [];

  // Use API returned summary or generate from filters
  const generateSummaryFromFilters = () => {
    if (!apiData?.filters) return 'Based on your preferences, we\'ve identified the best credit cards that match your financial goals.';
    
    const { cardTypes, rewardTypes, annualFeeRange } = apiData.filters;
    const cardTypesText = cardTypes?.length > 0 ? cardTypes.join(', ') : 'any card type';
    const rewardTypesText = rewardTypes?.length > 0 ? rewardTypes.join(', ') : 'various rewards';
    
    return `Based on your preferences for ${cardTypesText} with ${rewardTypesText} rewards, we've identified ${apiData.count || 0} credit cards that best match your financial goals.`;
  };
  
  const recommendationSummary = apiData?.summary || generateSummaryFromFilters();
  
  // Generate title from filters
  const generateTitle = () => {
    if (!apiData?.filters) return 'Credit Card Recommendations';
    const { rewardTypes } = apiData.filters;
    if (rewardTypes?.length > 0) {
      return rewardTypes.join(' & ') + ' Focus';
    }
    return 'Credit Card Recommendations';
  };
  
  const resultTitle = location?.state?.historyData?.title || generateTitle();

  // Helper to render list cells
  const renderList = (items) => (
    <ul className={styles.list}>
      {items.map((it, idx) => (
        <li key={idx}>{it}</li>
      ))}
    </ul>
  );

  // Render processing state
  const renderProcessingState = () => (
    <div className={styles.processingContainer}>
      <div className={styles.processingContent}>
        <div className={styles.spinner}></div>
        <h2>Analyzing Your Preferences</h2>
        <p className={styles.processingText}>
          Our AI is finding the best credit cards for you...
        </p>
        <p className={styles.processingEstimate}>
          This usually takes 15-20 seconds
        </p>
        <div className={styles.progressInfo}>
          <span className={styles.pollIndicator}>
            Checking status... ({pollCount} {pollCount === 1 ? 'check' : 'checks'})
          </span>
        </div>
      </div>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <span className={styles.errorIcon}>⚠️</span>
        <h2>Something Went Wrong</h2>
        <p className={styles.errorText}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => navigate('/app')}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.resultPage}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>AICC</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <button
            className={styles.navItem}
            onClick={() => navigate('/app')}
          >
            <span>New Recommendation</span>
          </button>
          <button 
            className={styles.navItem}
            onClick={() => navigate('/recommendation-history')}
          >
            <span>Recommendation History</span>
          </button>
          <button className={styles.navItem}>
            <span>Chat History</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Show processing state */}
        {isProcessing && renderProcessingState()}
        
        {/* Show error state */}
        {error && !isProcessing && renderErrorState()}
        
        {/* Show results when ready */}
        {!isProcessing && !error && recommendedCards.length > 0 && (
          <div className={styles.resultContainer}>
          <div className={styles.resultHeader}>
            <h1>Recommended Credit Cards</h1>
            <p className={styles.subtitle}>{resultTitle}</p>
          </div>

          {/* Summary Section */}
          <div className={styles.summarySection}>
            <h3 className={styles.summaryTitle}>Recommemdation Summary</h3>
            <p className={styles.summaryText}>{recommendationSummary}</p>
          </div>

          {/* Horizontal Comparison Table */}
          <div className={styles.cardsTableContainer}>
            <div className={styles.tableHeader}>
              <h2>Key Features Comparison</h2>
            </div>
            <div
              className={styles.comparisonTable}
              style={{ gridTemplateColumns: `220px repeat(${recommendedCards.length}, 1fr)` }}
            >
              {/* Header row */}
              <div className={`${styles.headerCell} ${styles.stickyCol}`}>Card</div>
              {recommendedCards.map(card => (
                <div key={`head-${card.id}`} className={styles.headerCell}>
                  <div className={styles.cardHeaderCompact}>
                    <div>
                      <div className={styles.cardNameCompact}>{card.name}</div>
                      <div className={styles.cardBankCompact}>{card.bankName} • {card.cardType}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Image row */}
              <div className={`${styles.featureCell} ${styles.stickyCol}`}>Card Cover</div>
              {recommendedCards.map(card => (
                <div key={`img-${card.id}`} className={styles.cell}>
                  <img src={card.image} alt={card.name} className={styles.cardImageLarge} />
                </div>
              ))}

              {/* Annual Fee */}
              <div className={`${styles.featureCell} ${styles.stickyCol}`}>Annual Fee</div>
              {recommendedCards.map(card => (
                <div key={`fee-${card.id}`} className={styles.cell}>{card.fee}</div>
              ))}

              {/* Rewards */}
              <div className={`${styles.featureCell} ${styles.stickyCol}`}>Rewards</div>
              {recommendedCards.map(card => (
                <div key={`rewards-${card.id}`} className={styles.cell}>{card.rewards}</div>
              ))}

              {/* Description */}
              <div className={`${styles.featureCell} ${styles.stickyCol}`}>Description</div>
              {recommendedCards.map(card => (
                <div key={`desc-${card.id}`} className={styles.cell}>{card.description}</div>
              ))}

              {/* Pros */}
              <div className={`${styles.featureCell} ${styles.stickyCol}`}>Pros</div>
              {recommendedCards.map(card => (
                <div key={`pros-${card.id}`} className={styles.cell}>{renderList(card.pros)}</div>
              ))}

              {/* Cons */}
              <div className={`${styles.featureCell} ${styles.stickyCol}`}>Cons</div>
              {recommendedCards.map(card => (
                <div key={`cons-${card.id}`} className={styles.cell}>{renderList(card.cons)}</div>
              ))}

              {/* Apply Button */}
              <div className={`${styles.featureCell} ${styles.stickyCol}`}>Apply</div>
              {recommendedCards.map(card => (
                <div key={`apply-${card.id}`} className={styles.cell}>
                  <a href={card.applyLink} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>
                    Apply Now
                  </a>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default RecommendationResultPage;
