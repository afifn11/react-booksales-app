export const authorService = {
  getAuthors: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/authors?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching authors:', error);
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching author:', error);
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create author');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating author:', error);
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update author');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating author:', error);
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete author');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting author:', error);
      throw error;
    }
  },
};