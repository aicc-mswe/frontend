import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendationResultPage.module.css';

function RecommendationResultPage() {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Mock data for recommended cards
  const recommendedCards = [
    {
      id: 1,
      name: 'Chase Sapphire Preferred',
      issuer: 'Chase',
      image: 'https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_preferred_card.png',
      annualFee: '$95',
      cardType: 'VISA',
      highlights: [
        'Earn 5x points on travel through Chase Travel',
        'Earn 3x points on dining and select streaming',
        'Earn 2x points on all other travel',
        '60,000 bonus points after spending $4,000 in 3 months',
        'No foreign transaction fees'
      ],
      applyLink: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'
    },
    {
      id: 2,
      name: 'American Express Gold Card',
      issuer: 'American Express',
      image: 'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-card.png',
      annualFee: '$250',
      cardType: 'American Express',
      highlights: [
        'Earn 4x points at restaurants worldwide',
        'Earn 4x points at U.S. supermarkets (up to $25,000 per year)',
        'Earn 3x points on flights booked directly with airlines',
        '$120 Uber Cash annually',
        '$120 dining credit annually'
      ],
      applyLink: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/'
    },
    {
      id: 3,
      name: 'Capital One Venture Rewards',
      issuer: 'Capital One',
      image: 'https://ecm.capitalone.com/WCM/card/products/venture-card-art.png',
      annualFee: '$95',
      cardType: 'VISA',
      highlights: [
        'Earn 2x miles on every purchase',
        '75,000 bonus miles after spending $4,000 in 3 months',
        'Transfer miles to 15+ travel loyalty programs',
        'No foreign transaction fees',
        'TSA PreCheck or Global Entry credit'
      ],
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
          <button className={styles.navItem}>
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
            <h1>Your Recommended Credit Cards</h1>
            <p className={styles.subtitle}>Based on your preferences, here are our top 3 recommendations</p>
          </div>

          {/* Card Recommendations */}
          <div className={styles.cardsGrid}>
            {recommendedCards.map((card) => (
              <div key={card.id} className={styles.cardItem}>
                <div className={styles.cardImageContainer}>
                  <div className={styles.cardImagePlaceholder}>
                    <span className={styles.cardIcon}>💳</span>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <h2>{card.name}</h2>
                  <p className={styles.issuer}>{card.issuer} • {card.cardType}</p>
                  <div className={styles.annualFee}>
                    <span className={styles.label}>Annual Fee:</span>
                    <span className={styles.value}>{card.annualFee}</span>
                  </div>
                  <div className={styles.highlights}>
                    <h3>Key Features</h3>
                    <ul>
                      {card.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={card.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applyBtn}
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Section */}
          <div className={styles.chatSection}>
            <h2>Have Questions About These Cards?</h2>
            <p className={styles.chatSubtitle}>Ask me anything about the recommended credit cards</p>
            
            <div className={`${styles.chatContainer} ${chatMessages.length === 0 ? styles.compact : ''}`}>
              {chatMessages.length > 0 && (
                <div className={styles.chatMessages}>
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`${styles.message} ${styles[message.type]}`}>
                      <div className={styles.messageContent}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className={styles.chatInputContainer}>
                <textarea
                  className={styles.chatInput}
                  placeholder="Ask a question about these credit cards..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={2}
                />
                <button
                  className={styles.sendBtn}
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === ''}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecommendationResultPage;
