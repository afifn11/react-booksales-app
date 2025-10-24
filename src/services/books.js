export const bookService = {
  getBooks: async (params = {}) => {
    try {
      const response = await fetch(`/api/books?${new URLSearchParams(params)}`, {
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

  getBook: async (id) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
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

  createBook: async (bookData) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '""')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
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

  getStatistics: async () => {
    try {
      const response = await fetch('/api/books/statistics', {
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