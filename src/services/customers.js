import { API_BASE_URL } from '../utils/constants';

// Helper function untuk API calls
const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const customerService = {
  // Menggunakan endpoint /users yang sudah ada di backend
  getCustomers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api(`/users?${queryString}`);
      return response;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomer: async (id) => {
    try {
      const response = await api(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const response = await api(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(customerData),
      });
      return response;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await api(`/users/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
};