import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendationHistoryPage.module.css';

function RecommendationHistoryPage() {
  const navigate = useNavigate();

  // Mock data for recommendation history
  const recommendationHistory = [
    {
      id: 1,
      date: '2024-01-15',
      title: 'Travel & Dining Focus',
      summary: 'Based on frequent travel and dining expenses',
      cards: 3,
      spendingPattern: 'High travel and dining expenses',
      preferences: ['Travel rewards', 'Dining cashback', 'No foreign fees'],
      recommendedCards: [
        {
          name: 'Chase Sapphire Preferred',
          bankName: 'Chase',
          fee: '$95',
          rewards: '5x travel, 3x dining, 2x other travel'
        },
        {
          name: 'American Express Gold Card',
          bankName: 'American Express',
          fee: '$250',
          rewards: '4x restaurants, 4x groceries, 3x flights'
        },
        {
          name: 'Capital One Venture Rewards',
          bankName: 'Capital One',
          fee: '$95',
          rewards: '2x miles on all purchases'
        }
      ]
    },
    {
      id: 2,
      date: '2024-01-10',
      title: 'Cash Back Optimization',
      summary: 'Optimized for maximum cash back rewards',
      cards: 3,
      spendingPattern: 'Mixed spending with focus on everyday purchases',
      preferences: ['Cash back', 'No annual fee', 'High rewards rate'],
      recommendedCards: [
        {
          name: 'Citi Double Cash Card',
          bankName: 'Citi',
          fee: '$0',
          rewards: '2% cash back on all purchases'
        },
        {
          name: 'Chase Freedom Unlimited',
          bankName: 'Chase',
          fee: '$0',
          rewards: '1.5% cash back on all purchases'
        },
        {
          name: 'Discover it Cash Back',
          bankName: 'Discover',
          fee: '$0',
          rewards: '5% rotating categories, 1% everything else'
        }
      ]
    },
    {
      id: 3,
      date: '2024-01-05',
      title: 'Premium Travel Cards',
      summary: 'High-end travel benefits and lounge access',
      cards: 3,
      spendingPattern: 'High travel spending, business expenses',
      preferences: ['Lounge access', 'Travel credits', 'Premium benefits'],
      recommendedCards: [
        {
          name: 'Chase Sapphire Reserve',
          bankName: 'Chase',
          fee: '$550',
          rewards: '3x travel, 3x dining, 1x everything else'
        },
        {
          name: 'American Express Platinum',
          bankName: 'American Express',
          fee: '$695',
          rewards: '5x flights, 5x hotels, 1x everything else'
        },
        {
          name: 'Capital One Venture X',
          bankName: 'Capital One',
          fee: '$395',
          rewards: '2x miles on all purchases'
        }
      ]
    },
    {
      id: 4,
      date: '2023-12-28',
      title: 'Student Credit Cards',
      summary: 'Entry-level cards for building credit history',
      cards: 3,
      spendingPattern: 'Low to moderate spending, building credit',
      preferences: ['No annual fee', 'Student-friendly', 'Credit building'],
      recommendedCards: [
        {
          name: 'Discover it Student Cash Back',
          bankName: 'Discover',
          fee: '$0',
          rewards: '5% rotating categories, 1% everything else'
        },
        {
          name: 'Capital One Journey Student',
          bankName: 'Capital One',
          fee: '$0',
          rewards: '1% cash back on all purchases'
        },
        {
          name: 'Bank of America Travel Rewards for Students',
          bankName: 'Bank of America',
          fee: '$0',
          rewards: '1.5x points on all purchases'
        }
      ]
    },
    {
      id: 5,
      date: '2023-12-20',
      title: 'Business Credit Cards',
      summary: 'Cards optimized for business expenses and rewards',
      cards: 3,
      spendingPattern: 'High business expenses, office supplies, travel',
      preferences: ['Business rewards', 'Expense tracking', 'Employee cards'],
      recommendedCards: [
        {
          name: 'Chase Ink Business Preferred',
          bankName: 'Chase',
          fee: '$95',
          rewards: '3x on business categories'
        },
        {
          name: 'American Express Business Gold',
          bankName: 'American Express',
          fee: '$295',
          rewards: '4x on top 2 business categories'
        },
        {
          name: 'Capital One Spark Cash Plus',
          bankName: 'Capital One',
          fee: '$150',
          rewards: '2% cash back on all purchases'
        }
      ]
    }
  ];

  const handleViewRecommendation = (historyItem) => {
    // Navigate to results page with the selected history data
    navigate('/results', { state: { historyData: historyItem } });
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
            <p className={styles.historySubtitle}>View your past credit card recommendations</p>
          </div>

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
                  </div>
                </div>
                
                <div className={styles.historyItemContent}>
                  <p className={styles.historySummary}>{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecommendationHistoryPage;
