import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    console.error('useWishlist must be used within a WishlistProvider');
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useLocalStorage('wishlistItems', []);

  // Validate wishlistItems on mount
  useEffect(() => {
    if (!Array.isArray(wishlistItems)) {
      console.warn('Invalid wishlistItems data, resetting to empty array');
      setWishlistItems([]);
    }
  }, [wishlistItems, setWishlistItems]);

  const addToWishlist = (book) => {
    setWishlistItems(prevItems => {
      const safePrevItems = Array.isArray(prevItems) ? prevItems : [];
      const existingItem = safePrevItems.find(item => item.id === book.id);
      if (!existingItem) {
        return [...safePrevItems, {
          id: book.id,
          title: book.title,
          price: book.price,
          cover_photo: book.cover_photo,
          author: book.author?.name || 'Unknown Author',
          stock: book.stock
        }];
      }
      return safePrevItems;
    });
  };

  const removeFromWishlist = (bookId) => {
    setWishlistItems(prevItems => {
      const safePrevItems = Array.isArray(prevItems) ? prevItems : [];
      return safePrevItems.filter(item => item.id !== bookId);
    });
  };

  const isInWishlist = (bookId) => {
    const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : [];
    return safeWishlistItems.some(item => item.id === bookId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = {
    wishlistItems: Array.isArray(wishlistItems) ? wishlistItems : [],
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};