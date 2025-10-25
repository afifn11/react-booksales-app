import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../components/layout/CustomerLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { bookService } from '../../services/books';
import { transactionService } from '../../services/transactions';
import { FiBook, FiShoppingCart, FiHeart, FiArrowRight, FiStar } from 'react-icons/fi';

const CustomerDashboard = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [stats, setStats] = useState({
    booksPurchased: 0,
    pendingOrders: 0,
    wishlistedItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load featured books
      const booksResponse = await bookService.getBooks({ per_page: 6 });
      setFeaturedBooks(booksResponse.data || []);
      
      // Load user transactions for stats
      const transactionsResponse = await transactionService.getMyTransactions();
      const transactions = transactionsResponse.data || [];
      
      // Calculate stats
      const booksPurchased = transactions.reduce((total, transaction) => total + transaction.quantity, 0);
      const pendingOrders = transactions.filter(t => !t.completed).length;
      
      setStats({
        booksPurchased,
        pendingOrders,
        wishlistedItems: 0 // This would come from a wishlist service
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
                      <Button size="large" className="bg-white text-gray-900 hover:bg-gray-100">
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
            <Button variant="outline" onClick={() => window.location.href = '/customer/books'}>
              View All <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
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

// Book Card Component
const BookCard = ({ book }) => {
  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log('Add to cart:', book.id);
  };

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
        
        <div className="flex items-center justify-between mt-3">
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
            onClick={handleAddToCart}
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