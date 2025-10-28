import { API_BASE_URL } from '../utils/constants';

// Helper function untuk API calls dengan error handling yang lebih baik
const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    try {
      const parsedToken = JSON.parse(token);
      headers.Authorization = `Bearer ${parsedToken}`;
    } catch (error) {
      console.warn('Invalid token format in localStorage');
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const transactionService = {
  getTransactions: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api(`/transactions?${queryString}`);
      return response;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  getTransaction: async (id) => {
    try {
      const response = await api(`/transactions/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  createTransaction: async (transactionData) => {
    try {
      console.log('Creating transaction with data:', transactionData);
      
      // Validasi data sebelum mengirim
      if (!transactionData.items || !Array.isArray(transactionData.items) || transactionData.items.length === 0) {
        throw new Error('Transaction must contain at least one item');
      }

      if (!transactionData.total_amount || transactionData.total_amount <= 0) {
        throw new Error('Invalid total amount');
      }

      const response = await api(`/transactions`, {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });
      
      console.log('Transaction created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const response = await api(`/transactions/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  getStatistics: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api(`/transactions/statistics?${queryString}`);
      return response;
    } catch (error) {
      console.error('Error fetching transaction statistics:', error);
      throw error;
    }
  },

  getMyTransactions: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api(`/transactions?${queryString}`);
      return response;
    } catch (error) {
      console.error('Error fetching my transactions:', error);
      throw error;
    }
  },
};

// Fallback implementation untuk development/testing
export const mockTransactionService = {
  createTransaction: async (transactionData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock success response
    return {
      success: true,
      message: 'Order placed successfully (Mock)',
      data: {
        id: Math.random().toString(36).substr(2, 9),
        order_number: `ORD-${Date.now()}`,
        ...transactionData,
        status: 'pending',
        created_at: new Date().toISOString(),
      }
    };
  }
};