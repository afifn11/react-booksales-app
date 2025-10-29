// src/pages/admin/Transactions/index.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { transactionService } from '../../../services/transactions';
import { formatCurrency, formatDate, formatNumber } from '../../../utils/helpers';
import { 
  FiEye, 
  FiTrash2, 
  FiSearch,
  FiFilter,
  FiShoppingCart,
  FiUser,
  FiBook,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    start_date: '',
    end_date: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      // Clean filters - remove empty values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await transactionService.getTransactions(cleanFilters);
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await transactionService.deleteTransaction(selectedTransaction.id);
      setSuccess('Transaction deleted successfully');
      loadTransactions();
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const openDetailModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const openDeleteModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
    setError('');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      start_date: '',
      end_date: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  const getStatusBadge = (transaction) => {
    // Since we don't have status field, we'll assume all are completed
    // You can add status field to your transactions if needed
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
    );
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading && transactions.length === 0) {
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Manage and view all customer transactions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(
                  transactions.reduce((total, transaction) => 
                    total + parseFloat(transaction.total_amount), 0)
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Filters */}
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order number, customer, or book..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="created_at">Newest</option>
                  <option value="total_amount">Amount</option>
                  <option value="order_number">Order Number</option>
                </select>
                <Button variant="outline" onClick={clearFilters}>
                  <FiFilter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<FiShoppingCart className="w-6 h-6 text-blue-600" />}
            title="Total Transactions"
            value={formatNumber(transactions.length)}
            color="blue"
          />
          <StatCard
            icon={<FiDollarSign className="w-6 h-6 text-green-600" />}
            title="Total Revenue"
            value={formatCurrency(
              transactions.reduce((total, transaction) => 
                total + parseFloat(transaction.total_amount), 0)
            )}
            color="green"
          />
          <StatCard
            icon={<FiBook className="w-6 h-6 text-purple-600" />}
            title="Books Sold"
            value={formatNumber(
              transactions.reduce((total, transaction) => 
                total + (transaction.quantity || 1), 0)
            )}
            color="purple"
          />
          <StatCard
            icon={<FiUser className="w-6 h-6 text-orange-600" />}
            title="Unique Customers"
            value={formatNumber(
              new Set(transactions.map(t => t.customer_id)).size
            )}
            color="orange"
          />
        </div>

        {/* Transactions Table */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                All Transactions ({transactions.length})
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transactions found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  {filters.search || filters.start_date || filters.end_date
                    ? 'Try adjusting your filters' 
                    : 'Transactions will appear here once customers make purchases'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <Table.Head>
                  <Table.Header>Order Number</Table.Header>
                  <Table.Header>Customer</Table.Header>
                  <Table.Header>Book</Table.Header>
                  <Table.Header>Quantity</Table.Header>
                  <Table.Header>Amount</Table.Header>
                  <Table.Header>Date</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Actions</Table.Header>
                </Table.Head>
                <Table.Body>
                  {transactions.map((transaction) => (
                    <Table.Row key={transaction.id}>
                      <Table.Cell>
                        <div className="font-medium text-gray-900">
                          {transaction.order_number}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <FiUser className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.customer?.name || 'Unknown Customer'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.customer?.email || ''}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center">
                          {transaction.book?.cover_photo ? (
                            <img
                              src={transaction.book.cover_photo}
                              alt={transaction.book.title}
                              className="w-10 h-12 object-cover rounded mr-3"
                            />
                          ) : (
                            <div className="w-10 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                              <FiBook className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.book?.title || 'Unknown Book'}
                            </p>
                            <p className="text-sm text-gray-500">
                              by {transaction.book?.author?.name || 'Unknown Author'}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium">{transaction.quantity || 1}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-bold text-green-600">
                          {formatCurrency(transaction.total_amount)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-gray-600">
                          {formatDate(transaction.created_at)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        {getStatusBadge(transaction)}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="small"
                            onClick={() => openDetailModal(transaction)}
                          >
                            <FiEye className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="danger" 
                            size="small"
                            onClick={() => openDeleteModal(transaction)}
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modals */}
        <TransactionDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
        />

        <DeleteTransactionModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
          onConfirm={handleDeleteTransaction}
        />
      </div>
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color = 'blue' }) => {
  const bgColorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <Card className="text-center p-6 hover:shadow-md transition-shadow duration-300">
      <div className={`w-12 h-12 ${bgColorClasses[color]} rounded-full flex items-center justify-center mx-auto mb-3`}>
        {icon}
      </div>
      <div className={`text-2xl font-bold ${bgColorClasses[color].split(' ')[1]} mb-2`}>
        {value}
      </div>
      <div className="text-gray-600 text-sm">{title}</div>
    </Card>
  );
};

// Transaction Detail Modal Component
const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" size="large">
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-medium">{transaction.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">{formatDate(transaction.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-bold text-green-600 text-lg">
                {formatCurrency(transaction.total_amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="font-medium">{transaction.quantity || 1} items</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
          <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {transaction.customer?.name || 'Unknown Customer'}
              </p>
              <p className="text-sm text-gray-600">
                {transaction.customer?.email || 'No email provided'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {transaction.customer?.role || 'customer'}
              </p>
            </div>
          </div>
        </div>

        {/* Book Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Book Information</h4>
          <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              {transaction.book?.cover_photo ? (
                <img
                  src={transaction.book.cover_photo}
                  alt={transaction.book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                  <FiBook className="w-8 h-8 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-gray-900 text-lg">
                {transaction.book?.title || 'Unknown Book'}
              </h5>
              <p className="text-gray-600 mb-2">
                by {transaction.book?.author?.name || 'Unknown Author'}
              </p>
              {transaction.book?.genre && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2">
                  {transaction.book.genre.name}
                </span>
              )}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-gray-600">Unit Price</p>
                  <p className="font-medium">
                    {formatCurrency(transaction.book?.price || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{transaction.quantity || 1}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">
                {formatCurrency(transaction.total_amount)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <span className="text-gray-600 font-semibold">Total Amount:</span>
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(transaction.total_amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Delete Transaction Modal Component
const DeleteTransactionModal = ({ isOpen, onClose, transaction, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Transaction" size="small">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <FiShoppingCart className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-gray-600">
              Are you sure you want to delete transaction <strong>"{transaction.order_number}"</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone and will restore the book stock.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Deleting this transaction will increase the stock of 
            "{transaction.book?.title || 'the book'}" by {transaction.quantity || 1} units.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
          >
            Delete Transaction
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Transactions;