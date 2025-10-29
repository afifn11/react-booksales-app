import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error('useCart must be used within a CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize with empty array and validate data
  const [cartItems, setCartItems] = useLocalStorage('cartItems', []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Validate cartItems on mount
  useEffect(() => {
    if (!Array.isArray(cartItems)) {
      console.warn('Invalid cartItems data, resetting to empty array');
      setCartItems([]);
    }
  }, [cartItems, setCartItems]);

  const addToCart = (book, quantity = 1) => {
    console.log('Adding to cart:', book, quantity);
    setCartItems(prevItems => {
      // Ensure prevItems is always an array
      const safePrevItems = Array.isArray(prevItems) ? prevItems : [];
      
      const existingItem = safePrevItems.find(item => item.id === book.id);
      
      if (existingItem) {
        return safePrevItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...safePrevItems, {
          id: book.id,
          title: book.title,
          price: book.price,
          cover_photo: book.cover_photo,
          author: book.author?.name || 'Unknown Author',
          stock: book.stock,
          quantity: quantity
        }];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => {
      const safePrevItems = Array.isArray(prevItems) ? prevItems : [];
      return safePrevItems.filter(item => item.id !== bookId);
    });
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCartItems(prevItems => {
      const safePrevItems = Array.isArray(prevItems) ? prevItems : [];
      return safePrevItems.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
    return safeCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
    return safeCartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems: Array.isArray(cartItems) ? cartItems : [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};