import { useApi } from '../hooks/useApi';

export const authorService = {
  getAuthors: async (params = {}) => {
    // Untuk service, kita tidak bisa menggunakan hook di sini
    // Kita akan menggunakan axios langsung
    try {
      const response = await fetch(`/api/authors?${new URLSearchParams(params)}`, {
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

  getAuthor: async (id) => {
    try {
      const response = await fetch(`/api/authors/${id}`, {
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

  createAuthor: async (authorData) => {
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateAuthor: async (id, authorData) => {
    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorData),
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteAuthor: async (id) => {
    try {
      const response = await fetch(`/api/authors/${id}`, {
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
};