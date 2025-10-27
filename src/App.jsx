import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/Books/index';
import AdminAuthors from './pages/admin/Authors/index';
import AdminGenres from './pages/admin/Genres/index';
import AdminTransactions from './pages/admin/Transactions/index';
import AdminCustomers from './pages/admin/Customers/index';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBooks from './pages/customer/Books/index';
import CustomerAuthors from './pages/customer/Authors/index';
import CustomerProfile from './pages/customer/Profile/index';
import CustomerTransactions from './pages/customer/Transactions/index';

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

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  return children;
};

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
      <Route path="/admin/customers" element={
        <ProtectedRoute requiredRole="admin">
          <AdminCustomers />
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
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;