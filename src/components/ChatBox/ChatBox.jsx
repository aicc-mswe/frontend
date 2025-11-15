import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatBox.module.css';

function ChatBox({ chatHistory, onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSendMessage = () => {
    if (!message.trim() || isLoading) return;

    onSendMessage(message.trim());
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={styles.chatBoxContainer}>
      <div className={styles.chatHeader}>
        <h3>Chat about this recommendation</h3>
        <p className={styles.chatSubtitle}>
          Ask questions about the recommended cards, benefits, or request alternative suggestions
        </p>
      </div>

      <div className={styles.chatMessages}>
        {chatHistory.length === 0 ? (
          <div className={styles.emptyChat}>
            <p>Start a conversation! Ask me anything about these credit cards.</p>
            <div className={styles.suggestionChips}>
              <button 
                className={styles.suggestionChip}
                onClick={() => setMessage("What are the key differences between these three cards?")}
              >
                Compare cards
              </button>
              <button 
                className={styles.suggestionChip}
                onClick={() => setMessage("Are there any additional benefits not mentioned in the pros?")}
              >
                More benefits?
              </button>
              <button 
                className={styles.suggestionChip}
                onClick={() => setMessage("Which card is best for frequent travelers?")}
              >
                Best for travel?
              </button>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((msg) => (
              <div 
                key={msg.id} 
                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageRole}>
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className={styles.messageTime}>
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <div className={styles.messageText}>{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageRole}>AI Assistant</span>
                  </div>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className={styles.chatInput}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here... (Press Enter to send, Shift+Enter for new line)"
          disabled={isLoading}
          rows={1}
          className={styles.textarea}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          className={styles.sendButton}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

ChatBox.propTypes = {
  chatHistory: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired
  })).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

ChatBox.defaultProps = {
  isLoading: false
};

export default ChatBox;
