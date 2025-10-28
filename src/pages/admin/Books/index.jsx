// src/pages/admin/Books/index.jsx

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { bookService } from '../../../services/books';
import { authorService } from '../../../services/authors';
import { genreService } from '../../../services/genres';
import { formatCurrency, formatNumber } from '../../../utils/helpers';
import { 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiBook,
  FiSearch,
  FiFilter,
  FiEye,
  FiDollarSign,
  FiPackage
} from 'react-icons/fi';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    genre_id: '',
    author_id: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBooks();
    loadFilters();
  }, [filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooks(filters);
      setBooks(response.data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [authorsResponse, genresResponse] = await Promise.all([
        authorService.getAuthors({ all: 'true' }),
        genreService.getGenres({ all: 'true' })
      ]);
      setAuthors(authorsResponse.data || []);
      setGenres(genresResponse.data || []);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const handleCreateBook = async (bookData) => {
    try {
      await bookService.createBook(bookData);
      setSuccess('Book created successfully');
      loadBooks();
      setShowCreateModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create book');
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      await bookService.updateBook(selectedBook.id, bookData);
      setSuccess('Book updated successfully');
      loadBooks();
      setShowEditModal(false);
      setSelectedBook(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update book');
    }
  };

  const handleDeleteBook = async () => {
    try {
      await bookService.deleteBook(selectedBook.id);
      setSuccess('Book deleted successfully');
      loadBooks();
      setShowDeleteModal(false);
      setSelectedBook(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
    setError('');
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
    setError('');
  };

  const openDetailModal = (book) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genre_id: '',
      author_id: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'red' };
    if (stock <= 5) return { text: 'Low Stock', color: 'yellow' };
    return { text: 'In Stock', color: 'green' };
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading && books.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Books</h1>
            <p className="text-gray-600">Manage books in your store</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Filters */}
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search books..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              
              <select
                value={filters.genre_id}
                onChange={(e) => handleFilterChange('genre_id', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.author_id}
                onChange={(e) => handleFilterChange('author_id', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>

              <div className="flex space-x-2">
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="created_at">Newest</option>
                  <option value="title">Title</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                </select>
                <Button variant="outline" onClick={clearFilters}>
                  <FiFilter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Books Table */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                All Books ({books.length})
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            {books.length === 0 ? (
              <div className="text-center py-8">
                <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No books found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  {filters.search || filters.genre_id || filters.author_id 
                    ? 'Try adjusting your filters' 
                    : 'Get started by adding your first book'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <Table.Head>
                  <Table.Header>Cover</Table.Header>
                  <Table.Header>Title</Table.Header>
                  <Table.Header>Author</Table.Header>
                  <Table.Header>Genre</Table.Header>
                  <Table.Header>Price</Table.Header>
                  <Table.Header>Stock</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Actions</Table.Header>
                </Table.Head>
                <Table.Body>
                  {books.map((book) => {
                    const stockStatus = getStockStatus(book.stock);
                    return (
                      <Table.Row key={book.id}>
                        <Table.Cell>
                          <BookCover book={book} />
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <p className="font-medium text-gray-900">{book.title}</p>
                            {book.description && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {book.description}
                              </p>
                            )}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-gray-600">{book.author?.name || 'Unknown'}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-gray-600">{book.genre?.name || 'Uncategorized'}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(book.price)}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-medium">{formatNumber(book.stock)}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}>
                            {stockStatus.text}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => openDetailModal(book)}
                            >
                              <FiEye className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => openEditModal(book)}
                            >
                              <FiEdit2 className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="small"
                              onClick={() => openDeleteModal(book)}
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modals */}
        <CreateBookModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBook}
          authors={authors}
          genres={genres}
        />

        <EditBookModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
          onSubmit={handleUpdateBook}
          authors={authors}
          genres={genres}
        />

        <DeleteBookModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
          onConfirm={handleDeleteBook}
        />

        <BookDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
        />
      </div>
    </AdminLayout>
  );
};

// Book Cover Component
const BookCover = ({ book }) => {
  if (book.cover_photo) {
    return (
      <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden">
        <img
          src={book.cover_photo}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full bg-gray-300 flex items-center justify-center hidden">
          <FiBook className="w-6 h-6 text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-purple-200 rounded flex items-center justify-center">
      <FiBook className="w-6 h-6 text-blue-600" />
    </div>
  );
};

// Create Book Modal Component
const CreateBookModal = ({ isOpen, onClose, onSubmit, authors, genres }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    cover_photo: '',
    author_id: '',
    genre_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      await onSubmit(submitData);
      setFormData({
        title: '',
        description: '',
        price: '',
        stock: '',
        cover_photo: '',
        author_id: '',
        genre_id: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Book" size="large">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Book Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter book description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Author
            </label>
            <select
              name="author_id"
              value={formData.author_id}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="">Select Author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Genre
            </label>
            <select
              name="genre_id"
              value={formData.genre_id}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Select Genre</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Cover Photo URL
          </label>
          <Input
            name="cover_photo"
            value={formData.cover_photo}
            onChange={handleChange}
            placeholder="https://example.com/cover.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a valid image URL. If no URL is provided, a default cover will be used.
          </p>
        </div>

        {/* Cover Preview */}
        {formData.cover_photo && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">Cover Preview:</p>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-28 bg-gray-200 rounded overflow-hidden">
                <img
                  src={formData.cover_photo}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center hidden">
                  <FiBook className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Cover preview will appear here</p>
                <p className="text-xs text-gray-500">Make sure the URL is accessible</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            Create Book
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Edit Book Modal Component
const EditBookModal = ({ isOpen, onClose, book, onSubmit, authors, genres }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    cover_photo: '',
    author_id: '',
    genre_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        description: book.description || '',
        price: book.price || '',
        stock: book.stock || '',
        cover_photo: book.cover_photo || '',
        author_id: book.author_id || '',
        genre_id: book.genre_id || ''
      });
    }
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      await onSubmit(submitData);
    } catch (err) {
      setError(err.message || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Book" size="large">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Current Cover Preview */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Current Cover
          </label>
          <div className="flex items-center space-x-4">
            <BookCover book={book} />
            <div className="text-sm text-gray-600">
              <p>Current book cover</p>
            </div>
          </div>
        </div>

        <Input
          label="Book Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter book description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Author
            </label>
            <select
              name="author_id"
              value={formData.author_id}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="">Select Author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Genre
            </label>
            <select
              name="genre_id"
              value={formData.genre_id}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Select Genre</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Cover Photo URL
          </label>
          <Input
            name="cover_photo"
            value={formData.cover_photo}
            onChange={handleChange}
            placeholder="https://example.com/cover.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a valid image URL. Leave empty to use default cover.
          </p>
        </div>

        {/* New Cover Preview */}
        {formData.cover_photo && formData.cover_photo !== book.cover_photo && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">New Cover Preview:</p>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-28 bg-gray-200 rounded overflow-hidden">
                <img
                  src={formData.cover_photo}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center hidden">
                  <FiBook className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>New cover preview</p>
                <p className="text-xs text-gray-500">Make sure the URL is accessible</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            Update Book
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Delete Book Modal Component
const DeleteBookModal = ({ isOpen, onClose, book, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Book" size="small">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <BookCover book={book} />
          <div>
            <p className="text-gray-600">
              Are you sure you want to delete <strong>"{book.title}"</strong>?
            </p>
          </div>
        </div>
        
        {book.transactions_count > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              This book has {book.transactions_count} transaction(s). Deleting this book may affect these records.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
          >
            Delete Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Book Detail Modal Component
const BookDetailModal = ({ isOpen, onClose, book }) => {
  if (!book) return null;

  const stockStatus = getStockStatus(book.stock);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Details" size="medium">
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-32 h-44 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {book.cover_photo ? (
              <img
                src={book.cover_photo}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                <FiBook className="w-12 h-12 text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-600 w-20">Author:</span>
                <span className="font-medium">{book.author?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600 w-20">Genre:</span>
                <span className="font-medium">{book.genre?.name || 'Uncategorized'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600 w-20">Price:</span>
                <span className="font-medium text-green-600">{formatCurrency(book.price)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600 w-20">Stock:</span>
                <span className="font-medium">{formatNumber(book.stock)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600 w-20">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}>
                  {stockStatus.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {book.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{book.description}</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Helper function for stock status (defined outside component)
const getStockStatus = (stock) => {
  if (stock === 0) return { text: 'Out of Stock', color: 'red' };
  if (stock <= 5) return { text: 'Low Stock', color: 'yellow' };
  return { text: 'In Stock', color: 'green' };
};

export default Books;