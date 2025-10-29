export const genreService = {
  getGenres: async (params = {}) => {
    try {
      const defaultParams = {
        per_page: 100, 
        ...params
      };
      
      const queryString = new URLSearchParams(defaultParams).toString();
      const response = await fetch(`/api/genres?${queryString}`, {
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
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  getGenre: async (id) => {
    try {
      const response = await fetch(`/api/genres/${id}`, {
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
      console.error('Error fetching genre:', error);
      throw error;
    }
  },

  createGenre: async (genreData) => {
    try {
      const response = await fetch('/api/genres', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(genreData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create genre');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating genre:', error);
      throw error;
    }
  },

  updateGenre: async (id, genreData) => {
    try {
      const response = await fetch(`/api/genres/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(genreData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update genre');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating genre:', error);
      throw error;
    }
  },

  deleteGenre: async (id) => {
    try {
      const response = await fetch(`/api/genres/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete genre');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting genre:', error);
      throw error;
    }
  },
};