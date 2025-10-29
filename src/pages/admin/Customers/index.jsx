// src/pages/admin/Customers/index.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { customerService } from '../../../services/customers';
import { transactionService } from '../../../services/transactions';
import { formatDate, formatNumber, formatCurrency } from '../../../utils/helpers';
import { 
  FiEye, 
  FiSearch,
  FiFilter,
  FiUser,
  FiMail,
  FiCalendar,
  FiShoppingCart,
  FiDollarSign,
  FiUserCheck,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [customerStats, setCustomerStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCustomers();
    loadCustomerStats();
  }, [filters]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setApiError('');
      
      console.log('Loading customers with filters:', filters);
      
      // Panggil API untuk mendapatkan semua users
      const response = await customerService.getCustomers(filters);
      console.log('API Response:', response);
      
      // Filter hanya customers (role = 'customer') dari response
      const allUsers = response.data || [];
      const customerUsers = allUsers.filter(user => user.role === 'customer');
      
      console.log('Filtered customers:', customerUsers);

      // Untuk setiap customer, hitung statistics dari transactions
      const customersWithStats = await Promise.all(
        customerUsers.map(async (user) => {
          let customerData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            last_access: user.last_access,
            created_at: user.created_at,
            transactions_count: 0,
            total_spent: 0,
            last_transaction: null
          };

          try {
            // Get transactions untuk customer ini
            const transactionsResponse = await transactionService.getTransactions();
            const allTransactions = transactionsResponse.data || [];
            
            // Filter transactions by customer_id
            const customerTransactions = allTransactions.filter(
              transaction => transaction.customer_id === user.id
            );
            
            console.log(`Transactions for customer ${user.id}:`, customerTransactions);
            
            if (customerTransactions.length > 0) {
              customerData.transactions_count = customerTransactions.length;
              customerData.total_spent = customerTransactions.reduce(
                (total, transaction) => total + parseFloat(transaction.total_amount || 0), 0
              );
              
              // Ambil transaction terbaru
              const latestTransaction = customerTransactions.reduce((latest, current) => {
                const currentDate = new Date(current.created_at || 0);
                const latestDate = new Date(latest.created_at || 0);
                return currentDate > latestDate ? current : latest;
              });
              customerData.last_transaction = latestTransaction.created_at;
            }
          } catch (error) {
            console.error(`Error loading transactions for customer ${user.id}:`, error);
          }

          return customerData;
        })
      );

      setCustomers(customersWithStats);
      console.log('Final customers data:', customersWithStats);
      
    } catch (error) {
      console.error('Failed to load customers:', error);
      setApiError(`Failed to load customers: ${error.message}`);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerStats = async () => {
    try {
      const response = await transactionService.getStatistics();
      console.log('Customer stats response:', response);
      setCustomerStats(response.data || {});
    } catch (error) {
      console.error('Failed to load customer stats:', error);
      // Fallback stats
      setCustomerStats({
        total_transactions: customers.reduce((sum, customer) => sum + customer.transactions_count, 0),
        total_revenue: customers.reduce((sum, customer) => sum + customer.total_spent, 0),
        total_books_sold: 0,
        unique_customers: customers.length
      });
    }
  };

  const openDetailModal = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
    setError('');
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
    setError('');
  };

  const handleUpdateCustomer = async (customerData) => {
    try {
      await customerService.updateCustomer(selectedCustomer.id, customerData);
      setSuccess('Customer updated successfully');
      loadCustomers();
      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      setError(error.message || 'Failed to update customer');
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      await customerService.deleteCustomer(selectedCustomer.id);
      setSuccess('Customer deleted successfully');
      loadCustomers();
      setShowDeleteModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      setError(error.message || 'Failed to delete customer');
    }
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
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  const getActivityStatus = (lastAccess) => {
    if (!lastAccess) return { status: 'Never Active', color: 'gray' };
    
    try {
      const lastAccessDate = new Date(lastAccess);
      const now = new Date();
      const diffDays = Math.floor((now - lastAccessDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return { status: 'Active Today', color: 'green' };
      if (diffDays <= 7) return { status: 'Active This Week', color: 'blue' };
      if (diffDays <= 30) return { status: 'Active This Month', color: 'yellow' };
      return { status: 'Inactive', color: 'red' };
    } catch (error) {
      return { status: 'Unknown', color: 'gray' };
    }
  };

  const getSpendingTier = (totalSpent) => {
    if (totalSpent >= 1000000) return { tier: 'VIP', color: 'purple' };
    if (totalSpent >= 500000) return { tier: 'Premium', color: 'blue' };
    if (totalSpent >= 100000) return { tier: 'Regular', color: 'green' };
    return { tier: 'New', color: 'gray' };
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

  // Tampilkan error jika API tidak tersedia
  if (apiError && customers.length === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <FiAlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">API Connection Error</h2>
          <p className="text-gray-600 text-center mb-4">{apiError}</p>
          <div className="text-sm text-gray-500 text-center mb-6 space-y-2">
            <p>Please check:</p>
            <p>• Backend server is running on port 8000</p>
            <p>• API endpoint /users is available</p>
            <p>• You are logged in as admin</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={loadCustomers} variant="primary">
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading && customers.length === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading customers data...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">Manage and view customer information</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={loadCustomers} 
              variant="outline" 
              size="small"
              disabled={loading}
            >
              <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-lg font-bold text-blue-600">
                {formatNumber(customers.length)}
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
                  placeholder="Search customers by name or email..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2"></div>

              <div className="flex space-x-2">
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="created_at">Newest</option>
                  <option value="name">Name</option>
                  <option value="transactions_count">Orders</option>
                  <option value="total_spent">Total Spent</option>
                  <option value="last_access">Last Active</option>
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
            icon={<FiUser className="w-6 h-6 text-blue-600" />}
            title="Total Customers"
            value={formatNumber(customers.length)}
            color="blue"
          />
          <StatCard
            icon={<FiShoppingCart className="w-6 h-6 text-green-600" />}
            title="Total Orders"
            value={formatNumber(customerStats.total_transactions || customers.reduce((sum, c) => sum + c.transactions_count, 0))}
            color="green"
          />
          <StatCard
            icon={<FiDollarSign className="w-6 h-6 text-purple-600" />}
            title="Total Revenue"
            value={formatCurrency(customerStats.total_revenue || customers.reduce((sum, c) => sum + c.total_spent, 0))}
            color="purple"
          />
          <StatCard
            icon={<FiUserCheck className="w-6 h-6 text-orange-600" />}
            title="Active Customers"
            value={formatNumber(
              customers.filter(customer => {
                if (!customer.last_access) return false;
                try {
                  const lastAccess = new Date(customer.last_access);
                  const now = new Date();
                  const diffDays = Math.floor((now - lastAccess) / (1000 * 60 * 60 * 24));
                  return diffDays <= 30;
                } catch {
                  return false;
                }
              }).length
            )}
            color="orange"
          />
        </div>

        {/* Customers Table */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                All Customers ({customers.length})
              </h3>
              {apiError && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded">
                  Partial data loaded
                </div>
              )}
            </div>
          </Card.Header>
          <Card.Body>
            {customers.length === 0 ? (
              <div className="text-center py-8">
                <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No customers found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  {filters.search 
                    ? 'Try adjusting your search terms' 
                    : 'No customer accounts found in the system'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <Table.Head>
                  <Table.Header>Customer</Table.Header>
                  <Table.Header>Contact</Table.Header>
                  <Table.Header>Orders</Table.Header>
                  <Table.Header>Total Spent</Table.Header>
                  <Table.Header>Last Active</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Actions</Table.Header>
                </Table.Head>
                <Table.Body>
                  {customers.map((customer) => {
                    const activityStatus = getActivityStatus(customer.last_access);
                    const spendingTier = getSpendingTier(customer.total_spent);
                    
                    return (
                      <Table.Row key={customer.id}>
                        <Table.Cell>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-sm">
                                {customer.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{customer.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{customer.role}</p>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="text-sm">
                            <p className="text-gray-900">{customer.email}</p>
                            <p className="text-gray-500">
                              Joined {formatDate(customer.created_at)}
                            </p>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="text-center">
                            <span className="font-bold text-blue-600 text-lg">
                              {customer.transactions_count}
                            </span>
                            <p className="text-xs text-gray-500">orders</p>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <p className="font-bold text-green-600">
                              {formatCurrency(customer.total_spent)}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${spendingTier.color}-100 text-${spendingTier.color}-800`}>
                              {spendingTier.tier}
                            </span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="text-sm">
                            <p className="text-gray-900">
                              {customer.last_access ? formatDate(customer.last_access) : 'Never'}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${activityStatus.color}-100 text-${activityStatus.color}-800`}>
                              {activityStatus.status}
                            </span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => openDetailModal(customer)}
                            >
                              <FiEye className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => openEditModal(customer)}
                            >
                              <FiEdit2 className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="small"
                              onClick={() => openDeleteModal(customer)}
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modals */}
        <CustomerDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
        />

        <EditCustomerModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          onSubmit={handleUpdateCustomer}
        />

        <DeleteCustomerModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          onConfirm={handleDeleteCustomer}
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

// Customer Detail Modal Component
const CustomerDetailModal = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  const activityStatus = getActivityStatus(customer.last_access);
  const spendingTier = getSpendingTier(customer.total_spent);
  const averageOrderValue = customer.transactions_count > 0 
    ? customer.total_spent / customer.transactions_count 
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Details" size="large">
      <div className="space-y-6">
        {/* Customer Profile */}
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-bold text-xl">
              {customer.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{customer.name}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {customer.role}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">{formatDate(customer.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Spending Tier</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${spendingTier.color}-100 text-${spendingTier.color}-800`}>
                  {spendingTier.tier}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Status */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{customer.transactions_count}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(customer.total_spent)}</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(averageOrderValue)}</p>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-orange-600">
                {customer.last_access ? formatDate(customer.last_access) : 'Never'}
              </p>
              <p className="text-sm text-gray-600">Last Active</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${activityStatus.color}-100 text-${activityStatus.color}-800`}>
              {activityStatus.status}
            </span>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FiShoppingCart className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-700">Total Orders Placed</span>
              </div>
              <span className="font-bold text-blue-600">{customer.transactions_count}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FiDollarSign className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Lifetime Value</span>
              </div>
              <span className="font-bold text-green-600">{formatCurrency(customer.total_spent)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-gray-700">Customer Since</span>
              </div>
              <span className="font-medium text-purple-600">{formatDate(customer.created_at)}</span>
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

// Edit Customer Modal Component
const EditCustomerModal = ({ isOpen, onClose, customer, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || ''
      });
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Customer" size="medium">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Customer Name
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Only basic information can be edited. For security reasons, 
            password changes must be done by the customer through their profile.
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
            type="submit"
            variant="primary"
            loading={loading}
          >
            Update Customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Delete Customer Modal Component
const DeleteCustomerModal = ({ isOpen, onClose, customer, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Customer" size="small">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <FiUser className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-gray-600">
              Are you sure you want to delete customer <strong>"{customer.name}"</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {customer.transactions_count > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              This customer has {customer.transactions_count} transaction(s). 
              Deleting this customer will also remove all their transaction history.
            </p>
          </div>
        )}

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
            Delete Customer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Helper functions
const getActivityStatus = (lastAccess) => {
  if (!lastAccess) return { status: 'Never Active', color: 'gray' };
  
  try {
    const lastAccessDate = new Date(lastAccess);
    const now = new Date();
    const diffDays = Math.floor((now - lastAccessDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { status: 'Active Today', color: 'green' };
    if (diffDays <= 7) return { status: 'Active This Week', color: 'blue' };
    if (diffDays <= 30) return { status: 'Active This Month', color: 'yellow' };
    return { status: 'Inactive', color: 'red' };
  } catch (error) {
    return { status: 'Unknown', color: 'gray' };
  }
};

const getSpendingTier = (totalSpent) => {
  if (totalSpent >= 1000000) return { tier: 'VIP', color: 'purple' };
  if (totalSpent >= 500000) return { tier: 'Premium', color: 'blue' };
  if (totalSpent >= 100000) return { tier: 'Regular', color: 'green' };
  return { tier: 'New', color: 'gray' };
};

export default Customers;