/**
 * Recommendation History Manager
 * Manages recommendation history using localStorage
 * Maximum 10 entries, newest first
 */

const HISTORY_KEY = 'recommendation_history';
const MAX_HISTORY_ENTRIES = 10;

/**
 * Get all recommendation history
 * @returns {Array} Array of recommendation history entries
 */
export const getHistory = () => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    const history = JSON.parse(historyJson);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Failed to get history from localStorage:', error);
    return [];
  }
};

/**
 * Save a new recommendation to history
 * Automatically keeps only the latest 10 entries
 * @param {Object} recommendation - The recommendation data to save
 * @returns {Object|null} The saved entry with ID, or null if failed
 */
export const saveRecommendation = (recommendation) => {
  try {
    // Validate input
    if (!recommendation || typeof recommendation !== 'object') {
      console.error('Invalid recommendation data');
      return null;
    }

    // Get existing history
    const history = getHistory();

    // Create new entry
    const newEntry = {
      id: Date.now().toString(), // Use timestamp as unique ID
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      timestamp: Date.now(), // For sorting
      chatHistory: [], // Initialize empty chat history
      ...recommendation
    };

    // Add to beginning of array (newest first)
    history.unshift(newEntry);

    // Keep only the latest MAX_HISTORY_ENTRIES entries
    const trimmedHistory = history.slice(0, MAX_HISTORY_ENTRIES);

    // Save to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));

    console.log(`Saved recommendation to history. Total entries: ${trimmedHistory.length}`);
    return newEntry; // Return the saved entry with ID
  } catch (error) {
    console.error('Failed to save recommendation to history:', error);
    return null;
  }
};

/**
 * Delete a specific recommendation from history
 * @param {string} id - The ID of the recommendation to delete
 * @returns {boolean} Success status
 */
export const deleteRecommendation = (id) => {
  try {
    const history = getHistory();
    const filteredHistory = history.filter(entry => entry.id !== id);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
    console.log(`Deleted recommendation ${id} from history`);
    return true;
  } catch (error) {
    console.error('Failed to delete recommendation:', error);
    return false;
  }
};

/**
 * Clear all recommendation history
 * @returns {boolean} Success status
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    console.log('Cleared all recommendation history');
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
};

/**
 * Get a specific recommendation by ID
 * @param {string} id - The ID of the recommendation
 * @returns {Object|null} The recommendation data or null if not found
 */
export const getRecommendationById = (id) => {
  try {
    const history = getHistory();
    return history.find(entry => entry.id === id) || null;
  } catch (error) {
    console.error('Failed to get recommendation by ID:', error);
    return null;
  }
};

/**
 * Get the count of saved recommendations
 * @returns {number} Number of saved recommendations
 */
export const getHistoryCount = () => {
  try {
    const history = getHistory();
    return history.length;
  } catch (error) {
    console.error('Failed to get history count:', error);
    return 0;
  }
};

/**
 * Add a chat message to a specific recommendation
 * @param {string} recommendationId - The ID of the recommendation
 * @param {Object} message - The chat message to add
 * @returns {boolean} Success status
 */
export const addChatMessage = (recommendationId, message) => {
  try {
    const history = getHistory();
    const recommendation = history.find(entry => entry.id === recommendationId);
    
    if (!recommendation) {
      console.error('Recommendation not found');
      return false;
    }
    
    // Initialize chatHistory if it doesn't exist
    if (!recommendation.chatHistory) {
      recommendation.chatHistory = [];
    }
    
    // Add message with timestamp and unique ID
    const newMessage = {
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
      ...message
    };
    
    recommendation.chatHistory.push(newMessage);
    
    // Save updated history
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    console.log(`Added chat message to recommendation ${recommendationId}`);
    return true;
  } catch (error) {
    console.error('Failed to add chat message:', error);
    return false;
  }
};

/**
 * Get chat history for a specific recommendation
 * @param {string} recommendationId - The ID of the recommendation
 * @returns {Array} Array of chat messages
 */
export const getChatHistory = (recommendationId) => {
  try {
    const recommendation = getRecommendationById(recommendationId);
    return recommendation?.chatHistory || [];
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return [];
  }
};

/**
 * Update the entire recommendation (useful after getting AI response)
 * @param {string} recommendationId - The ID of the recommendation
 * @param {Object} updates - The updates to apply
 * @returns {boolean} Success status
 */
export const updateRecommendation = (recommendationId, updates) => {
  try {
    const history = getHistory();
    const index = history.findIndex(entry => entry.id === recommendationId);
    
    if (index === -1) {
      console.error('Recommendation not found');
      return false;
    }
    
    history[index] = {
      ...history[index],
      ...updates
    };
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    console.log(`Updated recommendation ${recommendationId}`);
    return true;
  } catch (error) {
    console.error('Failed to update recommendation:', error);
    return false;
  }
};
