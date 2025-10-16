import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './RecommendationResultPage.module.css';

function RecommendationResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Mock data for recommended cards
  const recommendedCards = [
    {
      id: 1,
      name: 'Chase Sapphire Preferred',
      bankName: 'Chase',
      image: 'https://www.uscreditcardguide.com/wp-content/uploads/csp-e1629138224670.png',
      fee: '$95',
      cardType: 'VISA',
      rewards: '5x travel, 3x dining, 2x other travel',
      description: 'Perfect for travelers who want flexibility with points redemption and excellent travel protections. Great for those who spend heavily on dining and travel.',
      pros: ['Flexible point redemption', 'Strong travel protections', 'No foreign transaction fees'],
      cons: ['Higher annual fee', 'Requires good credit score'],
      applyLink: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'
    },
    {
      id: 2,
      name: 'American Express Gold Card',
      bankName: 'American Express',
      image: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-card.png',
      fee: '$250',
      cardType: 'American Express',
      rewards: '4x restaurants, 4x groceries, 3x flights',
      description: 'Ideal for food enthusiasts and frequent grocery shoppers. Offers excellent dining rewards and valuable annual credits.',
      pros: ['High dining rewards', 'Valuable annual credits', 'Premium benefits'],
      cons: ['Higher annual fee', 'Limited acceptance internationally'],
      applyLink: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'
    },
    {
      id: 3,
      name: 'Capital One Venture Rewards',
      bankName: 'Capital One',
      image: 'https://ecm.capitalone.com/WCM/card/products/venture-card-art.png',
      fee: '$95',
      cardType: 'VISA',
      rewards: '2x miles on all purchases',
      description: 'Simple and straightforward travel rewards card with consistent earning on all purchases. Great for those who want simplicity.',
      pros: ['Simple earning structure', 'No foreign transaction fees', 'Travel credits'],
      cons: ['Lower earning rate', 'Limited transfer partners'],
      applyLink: 'https://www.capitalone.com/credit-cards/venture/'
    }
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const newUserMessage = {
      type: 'user',
      content: inputMessage
    };

    // Mock AI response (you'll replace this with actual API call)
    const mockResponse = {
      type: 'assistant',
      content: 'Thank you for your question! This is a placeholder response. In the full implementation, I will provide detailed information about the credit cards based on your specific inquiry.'
    };

    setChatMessages([...chatMessages, newUserMessage, mockResponse]);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Summary text explaining the recommendations
  const recommendationSummary = `Based on your spending patterns and preferences, we've identified three credit cards that best match your financial goals. The Chase Sapphire Preferred offers excellent travel flexibility with strong dining rewards, making it ideal for frequent travelers. The American Express Gold Card maximizes rewards for dining and grocery spending, perfect for food enthusiasts. The Capital One Venture Rewards provides simple, consistent earning on all purchases with valuable travel benefits. Each card offers unique advantages: Sapphire Preferred for travel flexibility, Gold Card for dining maximization, and Venture for simplicity and broad acceptance.`;

  // Helper to render list cells
  const renderList = (items) => (
    <ul className={styles.list}>
      {items.map((it, idx) => (
        <li key={idx}>{it}</li>
      ))}
    </ul>
  );

  const resultTitle = location?.state?.historyData?.title || 'Travel & Dining Focus';

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

          {/* Chat Section - simplified to just input like AppPage */}
          <div className={styles.chatInputContainer}>
            <textarea
              className={styles.chatInput}
              placeholder="Ask a question about these credit cards... (Press Enter to send, Shift+Enter for newline)"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={2}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecommendationResultPage;
