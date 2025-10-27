import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { bookService } from '../../../services/books';
import { genreService } from '../../../services/genres';
import { authorService } from '../../../services/authors';
import { FiBook, FiShoppingCart, FiSearch, FiFilter } from 'react-icons/fi';

const CustomerBooks = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    genre_id: '',
    author_id: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

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
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [genresResponse, authorsResponse] = await Promise.all([
        genreService.getGenres({ all: 'true' }),
        authorService.getAuthors({ all: 'true' })
      ]);
      setGenres(genresResponse.data || []);
      setAuthors(authorsResponse.data || []);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddToCart = (bookId) => {
    // Implement add to cart functionality
    console.log('Add to cart:', bookId);
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

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Books</h1>
            <p className="text-gray-600">Discover amazing books from our collection</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <Card.Body>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search books by title or description..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Genre Filter */}
              <select
                value={filters.genre_id}
                onChange={(e) => handleFilterChange('genre_id', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-48 p-2.5"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              {/* Author Filter */}
              <select
                value={filters.author_id}
                onChange={(e) => handleFilterChange('author_id', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-48 p-2.5"
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-48 p-2.5"
              >
                <option value="created_at">Newest</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
              </select>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters}>
                <FiFilter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : books.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-12">
              <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No books found.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
            </Card.Body>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

// Book Card Component
const BookCard = ({ book, onAddToCart }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
        {book.cover_photo ? (
          <img
            src={book.cover_photo}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FiBook className="w-16 h-16 text-blue-600 opacity-50" />
        )}
        {book.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
      </div>
      <Card.Body>
        <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 mb-2 text-sm">by {book.author?.name || 'Unknown Author'}</p>
        
        {book.genre && (
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-3">
            {book.genre.name}
          </span>
        )}
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {book.description || 'No description available.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold text-blue-600">
              Rp {book.price?.toLocaleString() || '0'}
            </span>
            {book.stock > 0 && (
              <p className="text-xs text-green-600">{book.stock} in stock</p>
            )}
          </div>
          <Button 
            size="small" 
            onClick={() => onAddToCart(book.id)}
            disabled={book.stock === 0}
          >
            <FiShoppingCart className="w-4 h-4 mr-1" />
            {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomerBooks;