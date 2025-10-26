// API base URL - configurable via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Upload PDF file to backend
 * @param {File} pdfFile - PDF file to upload
 * @returns {Promise<Object>} Upload result with fileId
 */
export const uploadPDF = async (pdfFile) => {
  try {
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    
    console.log('Uploading PDF to:', `${API_BASE_URL}/upload/pdf`);
    
    const response = await fetch(`${API_BASE_URL}/upload/pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `PDF upload failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('PDF upload response data:', data);
    
    // Return the full response data
    // Backend may return: { success, message, fileId, fileName, filePath, ... }
    return data;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

/**
 * Generate credit card recommendations (async job submission)
 * @param {Object} requestData - Recommendation request data
 * @param {Array<string>} requestData.cardTypes - Selected card types
 * @param {Array<string>} requestData.rewardTypes - Selected reward types
 * @param {string} requestData.annualFeeRange - Annual fee range
 * @param {string|null} requestData.fileId - Previously uploaded PDF fileId
 * @param {string} requestData.additionalRequirements - Additional requirements description
 * @returns {Promise<Object>} Job submission result with jobId
 */
export const generateRecommendation = async (requestData) => {
  try {
    const formData = new FormData();
    
    // Add filter data to FormData
    const filterData = {
      cardTypes: requestData.cardTypes || [],
      rewardTypes: requestData.rewardTypes || [],
      annualFeeRange: requestData.annualFeeRange || 'any',
      additionalRequirements: requestData.additionalRequirements || ''
    };
    
    // Append JSON data
    formData.append('filters', JSON.stringify(filterData));
    
    // Append fileId if exists (from previous PDF upload)
    if (requestData.fileId) {
      console.log('Adding fileId to FormData:', requestData.fileId);
      formData.append('fileId', requestData.fileId);
    } else {
      console.log('No fileId provided to generateRecommendation');
    }
    
    console.log('Sending recommendation request to:', `${API_BASE_URL}/recommendations/generate`);
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(`  ${pair[0]}:`, pair[1]);
    }
    
    const response = await fetch(`${API_BASE_URL}/recommendations/generate`, {
      method: 'POST',
      body: formData,
      // Note: Do not manually set Content-Type when using FormData
      // Browser will automatically set the correct Content-Type with boundary
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating recommendation:', error);
    throw error;
  }
};

/**
 * Check recommendation job status and get results
 * @param {string} jobId - Job ID returned from generateRecommendation
 * @returns {Promise<Object>} Job status and data (if completed)
 */
export const checkRecommendationStatus = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/status/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check recommendation status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking recommendation status:', error);
    throw error;
  }
};

/**
 * Get recommendation history
 * @returns {Promise<Array>} List of recommendation history
 */
export const getRecommendationHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recommendation history: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendation history:', error);
    throw error;
  }
};

/**
 * Get specific recommendation by ID
 * @param {string} recommendationId - Recommendation ID
 * @returns {Promise<Object>} Recommendation details
 */
export const getRecommendationById = async (recommendationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/${recommendationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recommendation: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    throw error;
  }
};
