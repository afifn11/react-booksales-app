// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { bookService } from '../../services/books';
import { transactionService } from '../../services/transactions';
import { authorService } from '../../services/authors';
import { genreService } from '../../services/genres';
import { formatCurrency, formatDate, formatNumber } from '../../utils/helpers';
import { 
  FiBook, 
  FiUsers, 
  FiTag, 
  FiDollarSign, 
  FiShoppingCart, 
  FiTrendingUp,
  FiAlertTriangle,
  FiPackage,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalGenres: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    booksSold: 0,
    averageTransactionValue: 0,
    uniqueCustomers: 0,
    inventoryStats: {
      totalStock: 0,
      outOfStock: 0,
      lowStock: 0,
      totalValue: 0
    }
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [topSellingBooks, setTopSellingBooks] = useState([]); // TAMBAHKAN INI
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load data dengan endpoint yang tersedia
      const [
        booksResponse,
        authorsResponse,
        genresResponse,
        transactionsResponse
      ] = await Promise.all([
        bookService.getBooks({ per_page: 1000 }).catch(err => {
          console.error('Error loading books:', err);
          return { data: [] };
        }),
        authorService.getAuthors({ per_page: 1000 }).catch(err => {
          console.error('Error loading authors:', err);
          return { data: [] };
        }),
        genreService.getGenres({ per_page: 1000 }).catch(err => {
          console.error('Error loading genres:', err);
          return { data: [] };
        }),
        transactionService.getTransactions({ per_page: 1000 }).catch(err => {
          console.error('Error loading transactions:', err);
          return { data: [] };
        })
      ]);

      const booksData = booksResponse.data || [];
      const authorsData = authorsResponse.data || [];
      const genresData = genresResponse.data || [];
      const transactionsData = transactionsResponse.data || [];

      // Filter transactions berdasarkan time range
      const filteredTransactions = filterTransactionsByTimeRange(transactionsData, timeRange);

      // Hitung statistics manual
      const calculatedStats = calculateStatistics(
        booksData, 
        authorsData, 
        genresData, 
        filteredTransactions,
        transactionsData // all transactions untuk total
      );

      // Get recent transactions (5 terbaru)
      const recent = [...transactionsData]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      // Get top selling books
      const topBooks = calculateTopSellingBooks(transactionsData, booksData);

      setStats(calculatedStats);
      setRecentTransactions(recent);
      setBooks(booksData);
      setTopSellingBooks(topBooks); // SEKARANG SUDAH ADA

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactionsByTimeRange = (transactions, range) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return transactions.filter(transaction => 
      new Date(transaction.created_at) >= startDate
    );
  };

  const calculateStatistics = (books, authors, genres, filteredTransactions, allTransactions) => {
    // Hitung inventory stats
    const totalBooks = books.length;
    const totalStock = books.reduce((sum, book) => sum + (book.stock_quantity || 0), 0);
    const outOfStock = books.filter(book => (book.stock_quantity || 0) === 0).length;
    const lowStock = books.filter(book => (book.stock_quantity || 0) > 0 && (book.stock_quantity || 0) <= 5).length;
    const totalValue = books.reduce((sum, book) => sum + ((book.stock_quantity || 0) * (book.price || 0)), 0);

    // Hitung transaction stats dari filtered transactions
    const totalTransactions = filteredTransactions.length;
    const totalRevenue = filteredTransactions.reduce((sum, transaction) => sum + (transaction.total_amount || 0), 0);
    const totalBooksSold = filteredTransactions.reduce((sum, transaction) => sum + (transaction.quantity || 1), 0);
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Hitung unique customers dari semua transactions
    const uniqueCustomers = [...new Set(allTransactions.map(t => t.customer_id || t.user_id))].length;

    return {
      totalBooks,
      totalAuthors: authors.length,
      totalGenres: genres.length,
      totalTransactions,
      totalRevenue,
      totalBooksSold,
      averageTransactionValue,
      uniqueCustomers,
      inventoryStats: {
        totalStock,
        outOfStock,
        lowStock,
        totalValue
      }
    };
  };

  const calculateTopSellingBooks = (transactions, books) => {
    const bookSales = {};
    
    transactions.forEach(transaction => {
      // Jika transaction memiliki book_id langsung
      if (transaction.book_id) {
        bookSales[transaction.book_id] = (bookSales[transaction.book_id] || 0) + (transaction.quantity || 1);
      }
      
      // Jika transaction memiliki items array
      if (transaction.items && Array.isArray(transaction.items)) {
        transaction.items.forEach(item => {
          if (item.book_id) {
            bookSales[item.book_id] = (bookSales[item.book_id] || 0) + (item.quantity || 1);
          }
        });
      }
    });

    // Convert ke array dan gabungkan dengan data buku
    const topBooks = Object.entries(bookSales)
      .map(([book_id, total_sold]) => {
        const book = books.find(b => b.id === parseInt(book_id)) || {};
        return {
          book_id: parseInt(book_id),
          total_sold,
          book: {
            id: book.id,
            title: book.title,
            author: book.author,
            cover_photo: book.cover_photo
          }
        };
      })
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, 5);

    return topBooks;
  };

  const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  // Calculate mock previous data for demonstration
  const getMockPreviousData = (current, type) => {
    const reduction = type === 'count' ? Math.max(1, current * 0.2) : 
                     type === 'revenue' ? Math.max(10000, current * 0.15) : 
                     type === 'transactions' ? Math.max(1, current * 0.25) : 0;
    return Math.max(current - reduction, 0);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header dengan Time Range Filter */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your book store performance</p>
          </div>
          <div className="flex space-x-2">
            {['today', 'week', 'month', 'year'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'primary' : 'outline'}
                size="small"
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FiBook className="w-6 h-6" />}
            title="Total Books"
            value={formatNumber(stats.totalBooks)}
            change={getPercentageChange(stats.totalBooks, getMockPreviousData(stats.totalBooks, 'count'))}
            color="blue"
          />
          <StatCard
            icon={<FiUsers className="w-6 h-6" />}
            title="Total Authors"
            value={formatNumber(stats.totalAuthors)}
            change={getPercentageChange(stats.totalAuthors, getMockPreviousData(stats.totalAuthors, 'count'))}
            color="green"
          />
          <StatCard
            icon={<FiTag className="w-6 h-6" />}
            title="Total Genres"
            value={formatNumber(stats.totalGenres)}
            change={getPercentageChange(stats.totalGenres, getMockPreviousData(stats.totalGenres, 'count'))}
            color="purple"
          />
          <StatCard
            icon={<FiDollarSign className="w-6 h-6" />}
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            change={getPercentageChange(stats.totalRevenue, getMockPreviousData(stats.totalRevenue, 'revenue'))}
            color="orange"
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FiShoppingCart className="w-6 h-6" />}
            title="Total Transactions"
            value={formatNumber(stats.totalTransactions)}
            change={getPercentageChange(stats.totalTransactions, getMockPreviousData(stats.totalTransactions, 'transactions'))}
            color="indigo"
          />
          <StatCard
            icon={<FiPackage className="w-6 h-6" />}
            title="Books Sold"
            value={formatNumber(stats.totalBooksSold)}
            change={getPercentageChange(stats.totalBooksSold, getMockPreviousData(stats.totalBooksSold, 'count'))}
            color="teal"
          />
          <StatCard
            icon={<FiTrendingUp className="w-6 h-6" />}
            title="Avg. Order Value"
            value={formatCurrency(stats.averageTransactionValue)}
            change={getPercentageChange(stats.averageTransactionValue, getMockPreviousData(stats.averageTransactionValue, 'revenue'))}
            color="pink"
          />
          <StatCard
            icon={<FiUsers className="w-6 h-6" />}
            title="Unique Customers"
            value={formatNumber(stats.uniqueCustomers)}
            change={getPercentageChange(stats.uniqueCustomers, getMockPreviousData(stats.uniqueCustomers, 'count'))}
            color="red"
          />
        </div>

        {/* Inventory Alerts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AlertCard
            icon={<FiAlertTriangle className="w-6 h-6" />}
            title="Out of Stock"
            value={formatNumber(stats.inventoryStats.outOfStock)}
            description="Books that need restocking"
            color="red"
          />
          <AlertCard
            icon={<FiAlertTriangle className="w-6 h-6" />}
            title="Low Stock"
            value={formatNumber(stats.inventoryStats.lowStock)}
            description="Books with low inventory"
            color="yellow"
          />
          <AlertCard
            icon={<FiPackage className="w-6 h-6" />}
            title="Total Stock Value"
            value={formatCurrency(stats.inventoryStats.totalValue)}
            description="Current inventory value"
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                <Button variant="outline" size="small" onClick={() => window.location.href = '/admin/transactions'}>
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {recentTransactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent transactions</p>
                ) : (
                  recentTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Top Selling Books */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Top Selling Books</h3>
                <Button variant="outline" size="small" onClick={() => window.location.href = '/admin/books'}>
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {topSellingBooks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No sales data available</p>
                ) : (
                  topSellingBooks.map((item, index) => (
                    <TopBookItem 
                      key={item.book_id || index} 
                      item={item} 
                      rank={index + 1}
                    />
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickAction
                title="Add New Book"
                description="Create a new book entry"
                icon={<FiBook className="w-6 h-6" />}
                href="/admin/books/create"
                color="blue"
              />
              <QuickAction
                title="Manage Authors"
                description="View and edit authors"
                icon={<FiUsers className="w-6 h-6" />}
                href="/admin/authors"
                color="green"
              />
              <QuickAction
                title="View Reports"
                description="Sales and analytics"
                icon={<FiBarChart2 className="w-6 h-6" />}
                href="/admin/transactions"
                color="purple"
              />
              <QuickAction
                title="Inventory"
                description="Stock management"
                icon={<FiPackage className="w-6 h-6" />}
                href="/admin/books"
                color="orange"
              />
            </div>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, color = 'blue' }) => {
  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    indigo: 'bg-indigo-50',
    teal: 'bg-teal-50',
    pink: 'bg-pink-50',
    red: 'bg-red-50'
  };

  const textColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    teal: 'text-teal-600',
    pink: 'text-pink-600',
    red: 'text-red-600'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <Card.Body>
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${bgColorClasses[color]} ${textColorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center mt-1 text-sm ${
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.isPositive ? (
                  <FiArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <FiArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{change.value}% from previous period</span>
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Alert Card Component
const AlertCard = ({ icon, title, value, description, color = 'red' }) => {
  const colorClasses = {
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200'
  };

  return (
    <Card className={`border-2 ${colorClasses[color]} hover:shadow-md transition-shadow duration-300`}>
      <Card.Body>
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-white">
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs opacity-75">{description}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <FiShoppingCart className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {transaction.order_number || `TXN-${transaction.id}`}
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(transaction.created_at)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-green-600">
          {formatCurrency(transaction.total_amount || 0)}
        </p>
        <p className="text-sm text-gray-500">
          {transaction.quantity || transaction.items?.length || 1} items
        </p>
      </div>
    </div>
  );
};

// Top Book Item Component (diperbaiki)
const TopBookItem = ({ item, rank }) => {
  const book = item.book || {};
  const totalSold = item.total_sold || 0;
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
          rank === 1 ? 'bg-yellow-500' : 
          rank === 2 ? 'bg-gray-400' : 
          rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
        }`}>
          {rank}
        </div>
        <div className="flex items-center space-x-2">
          {book?.cover_photo ? (
            <img
              src={book.cover_photo}
              alt={book.title}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
              <FiBook className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 text-sm line-clamp-1">
              {book?.title || `Book #${item.book_id}`}
            </p>
            <p className="text-xs text-gray-500">
              {book?.author?.name || 'Unknown Author'}
            </p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-blue-600">{formatNumber(totalSold)}</p>
        <p className="text-xs text-gray-500">sold</p>
      </div>
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ title, description, icon, href, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
  };

  return (
    <button
      onClick={() => window.location.href = href}
      className={`p-4 rounded-lg text-left transition-colors duration-200 ${colorClasses[color]}`}
    >
      <div className="flex items-center mb-2">
        {icon}
      </div>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm opacity-75">{description}</p>
    </button>
  );
};

export default AdminDashboard;