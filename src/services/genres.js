export const genreService = {
  getGenres: async (params = {}) => {
    try {
      const response = await fetch(`/api/genres?${new URLSearchParams(params)}`, {
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

  getGenre: async (id) => {
    try {
      const response = await fetch(`/api/genres/${id}`, {
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
      return await response.json();
    } catch (error) {
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
      return await response.json();
    } catch (error) {
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
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};