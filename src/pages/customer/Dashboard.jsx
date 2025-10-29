import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/layout/CustomerLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { bookService } from '../../services/books';
import { transactionService } from '../../services/transactions';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatCurrency } from '../../utils/helpers';
import { FiBook, FiShoppingCart, FiHeart, FiArrowRight, FiEye } from 'react-icons/fi';

const CustomerDashboard = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [stats, setStats] = useState({
    booksPurchased: 0,
    pendingOrders: 0,
    wishlistedItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load featured books
      const booksResponse = await bookService.getBooks({ per_page: 8 });
      setFeaturedBooks(booksResponse.data || []);
      
      // Load user transactions for stats
      const transactionsResponse = await transactionService.getMyTransactions();
      const transactions = transactionsResponse.data || [];
      
      // Calculate stats
      const booksPurchased = transactions.reduce((total, transaction) => total + (transaction.quantity || 1), 0);
      const pendingOrders = transactions.filter(t => !t.completed).length;
      
      setStats({
        booksPurchased,
        pendingOrders,
        wishlistedItems: wishlistItems.length
      });
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carousel banners
  const banners = [
    {
      id: 1,
      title: "Summer Reading Sale",
      description: "Get up to 50% off on bestselling books",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      buttonText: "Shop Now",
      bgColor: "from-blue-600 to-purple-700"
    },
    {
      id: 2,
      title: "New Arrivals",
      description: "Discover the latest releases from top authors",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      buttonText: "Explore",
      bgColor: "from-green-600 to-blue-600"
    },
    {
      id: 3,
      title: "Free Shipping",
      description: "Free delivery on orders over Rp 200.000",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      buttonText: "Learn More",
      bgColor: "from-orange-600 to-red-600"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleAddToCart = (book) => {
    addToCart(book);
    // Bisa tambahkan toast notification di sini
  };

  const handleViewDetails = (bookId) => {
    navigate(`/customer/books/${bookId}`);
  };

  const handleWishlist = (book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
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

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Carousel Banner */}
        <section className="relative h-96 rounded-2xl overflow-hidden">
          <div className="relative h-full">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="relative h-full">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-2xl ml-12 text-white">
                      <h1 className="text-4xl font-bold mb-4">{banner.title}</h1>
                      <p className="text-xl mb-6 opacity-90">{banner.description}</p>
                      <Button 
                        size="large" 
                        onClick={() => navigate('/customer/books')}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        {banner.buttonText} <FiArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <FiArrowRight className="w-6 h-6 transform rotate-180" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <FiArrowRight className="w-6 h-6" />
          </button>
        </section>

        {/* Featured Books */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Books</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/customer/books')}
            >
              View All <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredBooks.map((book) => (
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
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<FiBook className="w-6 h-6 text-blue-600" />}
            value={stats.booksPurchased}
            label="Books Purchased"
            color="blue"
          />
          <StatCard
            icon={<FiShoppingCart className="w-6 h-6 text-green-600" />}
            value={stats.pendingOrders}
            label="Pending Orders"
            color="green"
          />
          <StatCard
            icon={<FiHeart className="w-6 h-6 text-purple-600" />}
            value={stats.wishlistedItems}
            label="Wishlisted Items"
            color="purple"
          />
        </section>
      </div>
    </CustomerLayout>
  );
};

// Book Card Component for Dashboard
const BookCard = ({ book, onAddToCart, onViewDetails, onWishlist, isWishlisted }) => {
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
              onWishlist(book);
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
                  {formatCurrency(book.price)}
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
};

// Stat Card Component
const StatCard = ({ icon, value, label, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card className="text-center p-6 hover:shadow-md transition-shadow duration-300">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center mx-auto mb-3`}>
        {icon}
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[1]} mb-2`}>
        {value}
      </div>
      <div className="text-gray-600">{label}</div>
    </Card>
  );
};

export default CustomerDashboard;