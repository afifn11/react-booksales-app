export const transactionService = {
  getTransactions: async (params = {}) => {
    try {
      const response = await fetch(`/api/transactions?${new URLSearchParams(params)}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getTransaction: async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  createTransaction: async (transactionData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getStatistics: async (params = {}) => {
    try {
      const response = await fetch(`/api/transactions/statistics?${new URLSearchParams(params)}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getMyTransactions: async (params = {}) => {
    try {
      const response = await fetch(`/api/my-transactions?${new URLSearchParams(params)}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};