import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import LoadingSpinner from './components/ui/LoadingSpinner';
import CartModal from './components/cart/CartModal';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/Books/index';
import AdminAuthors from './pages/admin/Authors/index';
import AdminGenres from './pages/admin/Genres/index';
import AdminTransactions from './pages/admin/Transactions/index';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBooks from './pages/customer/Books/index';
import CustomerAuthors from './pages/customer/Authors/index';
import CustomerProfile from './pages/customer/Profile/index';
import CustomerTransactions from './pages/customer/Transactions/index';
// New Customer Pages
import BookDetail from './pages/customer/BookDetail/index';
import Checkout from './pages/customer/Checkout/index';
import Wishlist from './pages/customer/Wishlist/index';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  return children;
};

// Cleanup corrupt localStorage data on app start
const cleanupLocalStorage = () => {
  const keys = ['cartItems', 'wishlistItems'];
  keys.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (item === 'undefined' || item === undefined) {
        localStorage.removeItem(key);
        console.log(`Cleaned up invalid ${key} from localStorage`);
      }
    } catch (error) {
      console.error(`Error cleaning up ${key}:`, error);
      localStorage.removeItem(key);
    }
  });
};

// Run cleanup
cleanupLocalStorage();

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/books" element={
        <ProtectedRoute requiredRole="admin">
          <AdminBooks />
        </ProtectedRoute>
      } />
      <Route path="/admin/authors" element={
        <ProtectedRoute requiredRole="admin">
          <AdminAuthors />
        </ProtectedRoute>
      } />
      <Route path="/admin/genres" element={
        <ProtectedRoute requiredRole="admin">
          <AdminGenres />
        </ProtectedRoute>
      } />
      <Route path="/admin/transactions" element={
        <ProtectedRoute requiredRole="admin">
          <AdminTransactions />
        </ProtectedRoute>
      } />

      {/* Customer Routes */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute requiredRole="customer">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/customer/books" element={
        <ProtectedRoute requiredRole="customer">
          <CustomerBooks />
        </ProtectedRoute>
      } />
      <Route path="/customer/books/:id" element={
        <ProtectedRoute requiredRole="customer">
          <BookDetail />
        </ProtectedRoute>
      } />
      <Route path="/customer/authors" element={
        <ProtectedRoute requiredRole="customer">
          <CustomerAuthors />
        </ProtectedRoute>
      } />
      <Route path="/customer/profile" element={
        <ProtectedRoute requiredRole="customer">
          <CustomerProfile />
        </ProtectedRoute>
      } />
      <Route path="/customer/transactions" element={
        <ProtectedRoute requiredRole="customer">
          <CustomerTransactions />
        </ProtectedRoute>
      } />
      <Route path="/customer/checkout" element={
        <ProtectedRoute requiredRole="customer">
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/customer/wishlist" element={
        <ProtectedRoute requiredRole="customer">
          <Wishlist />
        </ProtectedRoute>
      } />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
            <CartModal />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;