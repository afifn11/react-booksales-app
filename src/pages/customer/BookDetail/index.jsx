import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { bookService } from '../../../services/books';
import { useCart } from '../../../contexts/CartContext';
import { useWishlist } from '../../../contexts/WishlistContext';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { 
  FiArrowLeft, 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiBook,
  FiUser,
  FiTag,
  FiCalendar
} from 'react-icons/fi';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBook(id);
      setBook(response.data);
    } catch (error) {
      console.error('Failed to load book:', error);
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
    // Bisa tambahkan toast notification di sini
  };

  const handleWishlist = () => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(book.stock, value));
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </CustomerLayout>
    );
  }

  if (error || !book) {
    return (
      <CustomerLayout>
        <div className="text-center py-12">
          <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The book you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/customer/books')}>
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  const isWishlisted = isInWishlist(book.id);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Navigation */}
        <Button variant="outline" onClick={() => navigate('/customer/books')}>
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book Cover */}
          <div className="flex justify-center">
            <Card className="p-6">
              <div className="aspect-[3/4] w-full max-w-sm">
                {book.cover_photo ? (
                  <img
                    src={book.cover_photo}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <FiBook className="w-24 h-24 text-blue-300" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author?.name || 'Unknown Author'}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FiTag className="w-4 h-4 mr-1" />
                  {book.genre?.name || 'Uncategorized'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  Added {formatDate(book.created_at)}
                </div>
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-6">
                {formatCurrency(book.price)}
              </div>
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              book.stock > 5 
                ? 'bg-green-100 text-green-800' 
                : book.stock > 0 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {book.stock > 5 ? 'In Stock' : book.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              {book.stock > 0 && ` (${book.stock} available)`}
            </div>

            {/* Quantity Selector */}
            {book.stock > 0 && (
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= book.stock}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className="flex-1"
              >
                <FiShoppingCart className="w-5 h-5 mr-2" />
                {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                variant={isWishlisted ? "danger" : "outline"}
                size="large"
                onClick={handleWishlist}
                className="flex-1"
              >
                <FiHeart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Additional Actions */}
            <div className="flex space-x-4">
              <Button variant="outline" size="small">
                <FiShare2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'details', 'author'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Book Details</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Title</dt>
                      <dd className="text-gray-900">{book.title}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Author</dt>
                      <dd className="text-gray-900">{book.author?.name || 'Unknown'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Genre</dt>
                      <dd className="text-gray-900">{book.genre?.name || 'Uncategorized'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Price</dt>
                      <dd className="text-gray-900">{formatCurrency(book.price)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Stock</dt>
                      <dd className="text-gray-900">{book.stock} units</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'author' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">About the Author</h3>
                {book.author ? (
                  <div className="flex items-start space-x-4">
                    {book.author.photo ? (
                      <img
                        src={book.author.photo}
                        alt={book.author.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{book.author.name}</h4>
                      {book.author.bio ? (
                        <p className="text-gray-600 mt-2">{book.author.bio}</p>
                      ) : (
                        <p className="text-gray-500 mt-2">No biography available.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No author information available.</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default BookDetail;