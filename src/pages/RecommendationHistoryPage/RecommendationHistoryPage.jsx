import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteRecommendation, clearHistory } from '../../utils/historyManager';
import styles from './RecommendationHistoryPage.module.css';

function RecommendationHistoryPage() {
  const navigate = useNavigate();
  const [recommendationHistory, setRecommendationHistory] = useState([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = getHistory();
    setRecommendationHistory(history);
  };

  const handleDelete = (id, event) => {
    event.stopPropagation(); // Prevent navigation when clicking delete
    if (window.confirm('Are you sure you want to delete this recommendation?')) {
      const success = deleteRecommendation(id);
      if (success) {
        loadHistory(); // Reload history after deletion
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all recommendation history? This cannot be undone.')) {
      const success = clearHistory();
      if (success) {
        setRecommendationHistory([]);
      }
    }
  };

  const handleViewRecommendation = (historyItem) => {
    // Navigate to results page with the selected history data
    // Reconstruct the data structure expected by RecommendationResultPage
    const reconstructedData = {
      data: {
        summary: historyItem.summary,
        count: historyItem.cards,
        filters: historyItem.filters,
        recommendations: historyItem.recommendations
      }
    };
    
    navigate('/results', { 
      state: { 
        recommendationData: reconstructedData,
        historyData: historyItem,
        isProcessing: false,
        isFromHistory: true // Mark this as viewing from history
      } 
    });
  };

  return (
    <div className={styles.historyPage}>
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
              className={`${styles.navItem} ${styles.active}`}
              onClick={() => navigate('/recommendation-history')}
            >
              <span>Recommendation History</span>
            </button>
          <button className={styles.navItem}>
            <span>Chat History</span>
          </button>
        </nav>
      </aside>

      {/* Main Content - History List */}
      <main className={styles.mainContent}>
        <div className={styles.historyContainer}>
          <div className={styles.historyHeader}>
            <h1>Recommendation History</h1>
            <p className={styles.historySubtitle}>
              View your past credit card recommendations (Latest 10 entries)
            </p>
            {recommendationHistory.length > 0 && (
              <button 
                className={styles.clearAllBtn}
                onClick={handleClearAll}
              >
                Clear All History
              </button>
            )}
          </div>

          {recommendationHistory.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h3>No Recommendation History</h3>
              <p>You haven't generated any recommendations yet.</p>
              <button 
                className={styles.newRecommendationBtn}
                onClick={() => navigate('/app')}
              >
                Create New Recommendation
              </button>
            </div>
          ) : (
            <div className={styles.historyList}>
              {recommendationHistory.map((item) => (
                <div 
                  key={item.id} 
                  className={styles.historyItem}
                  onClick={() => handleViewRecommendation(item)}
                >
                  <div className={styles.historyItemHeader}>
                    <div className={styles.historyItemInfo}>
                      <h3>{item.title}</h3>
                      <p className={styles.historyDate}>{item.date}</p>
                    </div>
                    <div className={styles.historyItemStats}>
                      <span className={styles.cardCount}>{item.cards} cards</span>
                      <button 
                        className={styles.deleteBtn}
                        onClick={(e) => handleDelete(item.id, e)}
                        title="Delete this recommendation"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.historyItemContent}>
                    <p className={styles.historySummary}>{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RecommendationHistoryPage;
