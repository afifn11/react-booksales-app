import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { bookService } from '../../../services/books';
import { genreService } from '../../../services/genres';
import { authorService } from '../../../services/authors';
import { useCart } from '../../../contexts/CartContext';
import { useWishlist } from '../../../contexts/WishlistContext';
import { FiBook, FiShoppingCart, FiSearch, FiFilter, FiEye, FiHeart, FiX } from 'react-icons/fi';

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
  const [activeFilters, setActiveFilters] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  // Load filters data sekali saja saat mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await loadFilters();
        
        // Parse URL parameters setelah filters loaded
        const urlParams = new URLSearchParams(location.search);
        const authorId = urlParams.get('author_id');
        const authorName = urlParams.get('author_name');

        if (authorId && isInitialLoad) {
          const initialFilters = {
            search: '',
            genre_id: '',
            author_id: authorId,
            sort_by: 'created_at',
            sort_order: 'desc'
          };

          setFilters(initialFilters);
          
          if (authorName) {
            setActiveFilters([{
              type: 'author_id',
              value: authorName,
              id: authorId
            }]);
          }
        }
        
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setIsInitialLoad(false);
      }
    };

    loadInitialData();
  }, [location.search]);

  // Debounced search untuk menghindari terlalu banyak API calls
  useEffect(() => {
    if (isInitialLoad) return;

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout untuk debounce
    const timeoutId = setTimeout(() => {
      loadBooks();
    }, filters.search ? 500 : 300); // Debounce lebih lama untuk search

    setSearchTimeout(timeoutId);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [filters, isInitialLoad]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      
      // Hanya kirim parameter yang memiliki nilai
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      console.time('loadBooks');
      const response = await bookService.getBooks(cleanFilters);
      console.timeEnd('loadBooks');
      
      setBooks(response.data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      console.time('loadFilters');
      const [genresResponse, authorsResponse] = await Promise.all([
        genreService.getGenres({ per_page: 100 }), // Limit results
        authorService.getAuthors({ per_page: 100 }) // Limit results
      ]);
      console.timeEnd('loadFilters');
      
      setGenres(genresResponse.data || []);
      setAuthors(authorsResponse.data || []);
    } catch (error) {
      console.error('Failed to load filters:', error);
      setGenres([]);
      setAuthors([]);
    }
  };

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value
      };
      
      // Update URL jika author_id berubah (tanpa debounce)
      if (key === 'author_id') {
        const author = authors.find(a => a.id == value);
        const urlParams = new URLSearchParams();
        if (value) {
          urlParams.set('author_id', value);
          if (author) {
            urlParams.set('author_name', author.name);
          }
          navigate(`?${urlParams.toString()}`, { replace: true });
        } else {
          navigate('/customer/books', { replace: true });
        }
      }

      // Update active filters
      updateActiveFilters(newFilters);
      
      return newFilters;
    });
  }, [authors, navigate]);

  const updateActiveFilters = useCallback((newFilters) => {
    const newActiveFilters = [];

    if (newFilters.search) {
      newActiveFilters.push({
        type: 'search',
        value: `Search: ${newFilters.search}`,
        id: 'search'
      });
    }

    if (newFilters.author_id) {
      const author = authors.find(a => a.id == newFilters.author_id);
      if (author) {
        newActiveFilters.push({
          type: 'author_id',
          value: author.name,
          id: newFilters.author_id
        });
      }
    }

    if (newFilters.genre_id) {
      const genre = genres.find(g => g.id == newFilters.genre_id);
      if (genre) {
        newActiveFilters.push({
          type: 'genre_id',
          value: genre.name,
          id: newFilters.genre_id
        });
      }
    }

    setActiveFilters(newActiveFilters);
  }, [authors, genres]);

  const removeFilter = useCallback((filterType) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: ''
      };
      
      // Update URL jika menghapus author filter
      if (filterType === 'author_id') {
        navigate('/customer/books', { replace: true });
      }

      // Update active filters
      updateActiveFilters(newFilters);
      
      return newFilters;
    });
  }, [navigate, updateActiveFilters]);

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      genre_id: '',
      author_id: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    setActiveFilters([]);
    navigate('/customer/books', { replace: true });
  }, [navigate]);

  const handleAddToCart = useCallback((book) => {
    addToCart(book);
  }, [addToCart]);

  const handleViewDetails = useCallback((bookId) => {
    navigate(`/customer/books/${bookId}`);
  }, [navigate]);

  const handleWishlist = useCallback((bookId) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      if (isInWishlist(bookId)) {
        removeFromWishlist(bookId);
      } else {
        addToWishlist(book);
      }
    }
  }, [books, isInWishlist, removeFromWishlist, addToWishlist]);

  // Memoized computed values
  const { pageTitle, pageDescription } = useMemo(() => {
    const currentAuthor = activeFilters.find(f => f.type === 'author_id');
    return {
      pageTitle: currentAuthor ? `Books by ${currentAuthor.value}` : 'Books',
      pageDescription: currentAuthor 
        ? `Discover all books written by ${currentAuthor.value}`
        : 'Discover amazing books from our collection'
    };
  }, [activeFilters]);

  // Book Card Component - dipindah keluar untuk avoid re-render
  const BookCard = React.memo(({ book, onAddToCart, onViewDetails, onWishlist, isWishlisted }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
          {/* Book Cover with Overlay */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
            {book.cover_photo ? (
              <img
                src={book.cover_photo}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy" // Lazy loading untuk images
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiBook className="w-12 h-12 text-blue-300" />
              </div>
            )}
            
            {/* Stock Badge */}
            {book.stock === 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                Out of Stock
              </div>
            )}
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWishlist(book.id);
              }}
              className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            {/* Hover Overlay with Buttons */}
            <div className={`absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="flex flex-col space-y-2">
                <Button 
                  size="small" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(book);
                  }}
                  disabled={book.stock === 0}
                  className="bg-transparent text-white hover:bg-blue-600 hover:text-white border-white hover:border-blue-600"
                >
                  <FiShoppingCart className="w-4 h-4 mr-1" />
                  {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button 
                  size="small" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(book.id);
                  }}
                  className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900"
                >
                  <FiEye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-semibold text-sm mb-1 text-gray-900 line-clamp-2 leading-tight">
              {book.title}
            </h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-1">
              by {book.author?.name || 'Unknown Author'}
            </p>
            
            {book.genre && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2">
                {book.genre.name}
              </span>
            )}
            
            <div className="mt-auto pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-blue-600">
                    Rp {book.price?.toLocaleString('id-ID') || '0'}
                  </span>
                  {book.stock > 0 && (
                    <p className="text-xs text-green-600 mt-1">{book.stock} in stock</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  });

  // Render books grid dengan virtual scrolling sederhana
  const booksGrid = useMemo(() => {
    if (books.length === 0) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {books.map((book) => (
          <BookCard 
            key={book.id} 
            book={book}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onWishlist={handleWishlist}
            isWishlisted={isInWishlist(book.id)}
          />
        ))}
      </div>
    );
  }, [books, handleAddToCart, handleViewDetails, handleWishlist, isInWishlist]);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-600">{pageDescription}</p>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Card>
            <Card.Body>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {activeFilters.map((filter) => (
                  <span
                    key={`${filter.type}-${filter.id}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {filter.value}
                    <button
                      onClick={() => removeFilter(filter.type)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <Button
                  variant="outline"
                  size="small"
                  onClick={clearAllFilters}
                  className="ml-2"
                >
                  Clear All
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

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
              <Button variant="outline" onClick={clearAllFilters}>
                <FiFilter className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Results Count */}
        {!loading && (
          <div className="text-sm text-gray-600">
            Showing {books.length} book{books.length !== 1 ? 's' : ''}
            {activeFilters.find(f => f.type === 'author_id') && ` by ${activeFilters.find(f => f.type === 'author_id')?.value}`}
            {filters.search && ` for "${filters.search}"`}
            {filters.genre_id && !activeFilters.find(f => f.type === 'author_id') && ` in ${activeFilters.find(f => f.type === 'genre_id')?.value}`}
          </div>
        )}

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
              <p className="text-gray-400 mt-2">
                {filters.author_id || filters.genre_id || filters.search 
                  ? 'Try adjusting your search filters' 
                  : 'No books available at the moment'
                }
              </p>
              {(filters.author_id || filters.genre_id || filters.search) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          booksGrid
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerBooks;