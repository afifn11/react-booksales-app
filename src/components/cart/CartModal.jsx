import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';

const CartModal = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/customer/checkout');
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    navigate('/customer/books');
  };

  return (
    <Modal 
      isOpen={isCartOpen} 
      onClose={() => setIsCartOpen(false)}
      title="Shopping Cart"
      size="large"
    >
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-1">
              Add some books to get started
            </p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {item.cover_photo ? (
                    <img
                      src={item.cover_photo}
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <FiShoppingCart className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">by {item.author}</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(getCartTotal())}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1"
                >
                  Clear Cart
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCheckout}
                  className="flex-1"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CartModal;