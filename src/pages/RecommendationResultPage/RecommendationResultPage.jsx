import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkRecommendationStatus, sendChatMessage } from '../../services/api';
import { saveRecommendation, addChatMessage } from '../../utils/historyManager';
import ChatBox from '../../components/ChatBox/ChatBox';
import styles from './RecommendationResultPage.module.css';

function RecommendationResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [isProcessing, setIsProcessing] = useState(location?.state?.isProcessing || false);
  const [recommendationData, setRecommendationData] = useState(null);
  const [error, setError] = useState(null);
  const [pollCount, setPollCount] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentRecommendationId, setCurrentRecommendationId] = useState(null);

  // Get jobId or direct data from location state
  const jobId = location?.state?.jobId;
  const directData = location?.state?.recommendationData;
  const requestFilters = location?.state?.requestFilters;
  const isFromHistory = location?.state?.isFromHistory; // Flag to check if viewing from history

  // Save recommendation to history when data is loaded (only for NEW recommendations)
  useEffect(() => {
    // Don't save if this is from viewing history
    if (isFromHistory) {
      console.log('Viewing recommendation from history - skipping save');
      // Load existing recommendation ID and chat history
      const historyData = location?.state?.historyData;
      if (historyData) {
        setCurrentRecommendationId(historyData.id);
        setChatHistory(historyData.chatHistory || []);
      }
      return;
    }

    if (recommendationData && !isProcessing && !error) {
      // Prepare data to save
      const apiData = recommendationData?.data;
      const recommendedCards = apiData?.recommendations || [];
      
      if (recommendedCards.length > 0) {
        // Generate title from filters
        const rewardTypes = apiData?.filters?.rewardTypes?.filter(type => type && type.toLowerCase() !== 'any');
        const title = rewardTypes?.length > 0 
          ? rewardTypes.join(' & ') + ' Rewards'
          : 'Personalized Recommendations';
        
        // Generate summary
        const summary = apiData?.summary || `Based on your preferences, we've identified ${recommendedCards.length} credit cards that match your financial goals.`;
        
        // Save to history
        const historyEntry = {
          title,
          summary,
          cards: recommendedCards.length,
          filters: apiData?.filters || requestFilters || {},
          recommendations: recommendedCards,
          fullData: recommendationData // Save complete response for reference
        };
        
        const savedEntry = saveRecommendation(historyEntry);
        if (savedEntry) {
          console.log('Recommendation saved to history successfully');
          setCurrentRecommendationId(savedEntry.id);
          setChatHistory([]);
        }
      }
    }
  }, [recommendationData, isProcessing, error, requestFilters, isFromHistory, location?.state?.historyData]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, directData]);

  // Extract data from API response structure
  const apiData = recommendationData?.data;
  
  // Use API returned card data from recommendations array
  const recommendedCards = apiData?.recommendations || [];

  // Use AI-generated summary if available, otherwise generate from filters
  const generateSummaryFromFilters = () => {
    if (!apiData?.filters) return 'Based on your preferences, we\'ve identified the best credit cards that match your financial goals.';
    
    const { cardTypes, rewardTypes } = apiData.filters;
    const cardTypesText = cardTypes?.length > 0 ? cardTypes.join(', ') : 'any card type';
    const rewardTypesText = rewardTypes?.length > 0 ? rewardTypes.join(', ') : 'various rewards';
    
    return `Based on your preferences for ${cardTypesText} with ${rewardTypesText} rewards, we've identified ${apiData.count || 0} credit cards that best match your financial goals.`;
  };
  
  // Prioritize AI-generated summary over auto-generated one
  const recommendationSummary = apiData?.summary || generateSummaryFromFilters();
  
  // Generate title from filters
  const generateTitle = () => {
    if (!apiData?.filters) return 'Personalized Recommendations';
    const { rewardTypes } = apiData.filters;
    
    // Filter out "Any" or empty values
    const validRewardTypes = rewardTypes?.filter(type => type && type.toLowerCase() !== 'any');
    
    if (validRewardTypes?.length > 0) {
      return validRewardTypes.join(' & ') + ' Rewards';
    }
    return 'Personalized Recommendations';
  };
  
  const resultTitle = location?.state?.historyData?.title || generateTitle();

  // Handle sending chat messages
  const handleSendChatMessage = async (message) => {
    if (!currentRecommendationId || !message.trim()) return;

    // Add user message to chat history
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    setChatHistory(prev => [...prev, userMessage]);
    addChatMessage(currentRecommendationId, userMessage);
    setIsChatLoading(true);

    try {
      // Prepare recommendation data for context
      const contextData = {
        summary: recommendationSummary,
        title: resultTitle,
        filters: apiData?.filters || {},
        recommendations: recommendedCards
      };

      // Send message to backend
      const response = await sendChatMessage(
        currentRecommendationId,
        message,
        chatHistory,
        contextData
      );

      // Add assistant response to chat history
      const assistantMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response.data?.reply || response.reply || 'Sorry, I could not generate a response.',
        timestamp: Date.now()
      };

      setChatHistory(prev => [...prev, assistantMessage]);
      addChatMessage(currentRecommendationId, assistantMessage);
    } catch (error) {
      console.error('Failed to send chat message:', error);
      
      // Add error message
      const errorMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: Date.now()
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
      addChatMessage(currentRecommendationId, errorMessage);
    } finally {
      setIsChatLoading(false);
    }
  };

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
            <h3 className={styles.summaryTitle}>
              {apiData?.summary ? 'AI Recommendation Summary' : 'Recommendation Summary'}
            </h3>
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

              {/* Sign-up Bonus */}
              <div className={`${styles.featureCell} ${styles.stickyCol}`}>Sign-up Bonus</div>
              {recommendedCards.map(card => (
                <div key={`bonus-${card.id}`} className={styles.cell}>{card.signUpBonus || 'N/A'}</div>
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

          {/* Chat Box - Only show when recommendation is loaded */}
          {currentRecommendationId && (
            <ChatBox
              chatHistory={chatHistory}
              onSendMessage={handleSendChatMessage}
              isLoading={isChatLoading}
            />
          )}
          </div>
        )}
      </main>
    </div>
  );
}

export default RecommendationResultPage;
