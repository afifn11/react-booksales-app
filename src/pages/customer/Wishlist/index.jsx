import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useWishlist } from '../../../contexts/WishlistContext';
import { useCart } from '../../../contexts/CartContext';
import { formatCurrency } from '../../../utils/helpers';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiTrash2, 
  FiEye,
  FiArrowRight,
  FiBook
} from 'react-icons/fi';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = useCallback((book) => {
    addToCart(book);
    // Bisa tambahkan toast notification
  }, [addToCart]);

  const handleViewDetails = useCallback((bookId) => {
    navigate(`/customer/books/${bookId}`);
  }, [navigate]);

  const handleMoveAllToCart = useCallback(() => {
    wishlistItems.forEach(book => addToCart(book));
    clearWishlist();
  }, [wishlistItems, addToCart, clearWishlist]);

  // Book Card Component - konsisten dengan Books page
  const BookCard = ({ book, onAddToCart, onViewDetails, onRemoveFromWishlist }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
          {/* Book Cover with Overlay - sama persis dengan Books page */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
            {book.cover_photo ? (
              <img
                src={book.cover_photo}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiBook className="w-12 h-12 text-blue-300" />
              </div>
            )}
            
            {/* Stock Badge - sama dengan Books page */}
            {book.stock === 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                Out of Stock
              </div>
            )}
            
            {/* Remove from Wishlist Button - menggantikan wishlist button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromWishlist(book.id);
              }}
              className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full transition-colors hover:bg-red-600"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
            
            {/* Hover Overlay with Buttons - sama dengan Books page */}
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

          {/* Book Info - sama dengan Books page */}
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-semibold text-sm mb-1 text-gray-900 line-clamp-2 leading-tight">
              {book.title}
            </h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-1">
              by {book.author || 'Unknown Author'}
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

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">Your saved books</p>
          </div>
          {wishlistItems.length > 0 && (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={clearWishlist}>
                Clear All
              </Button>
              <Button variant="primary" onClick={handleMoveAllToCart}>
                Add All to Cart
              </Button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-12">
              <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your wishlist is empty</p>
              <p className="text-gray-400 mt-2">
                Save your favorite books to find them easily later
              </p>
              <Button 
                variant="primary" 
                className="mt-4"
                onClick={() => navigate('/customer/books')}
              >
                <FiArrowRight className="w-4 h-4 mr-2" />
                Browse Books
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlistItems.map((book) => (
              <BookCard 
                key={book.id} 
                book={book}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                onRemoveFromWishlist={removeFromWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default Wishlist;