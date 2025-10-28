// src/pages/customer/Transactions/index.jsx

import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { transactionService } from '../../../services/transactions';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { FiShoppingCart, FiCalendar, FiDollarSign } from 'react-icons/fi';

const CustomerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getMyTransactions();
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (transaction) => {
    // You might want to add status field to your transactions
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
    );
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">View your order history and track your purchases</p>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FiShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FiCalendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.filter(t => {
                    const transactionDate = new Date(t.created_at);
                    const now = new Date();
                    return transactionDate.getMonth() === now.getMonth() && 
                           transactionDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <FiDollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(transactions.reduce((total, t) => total + parseFloat(t.total_amount), 0))}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Order History</h3>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No orders found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Your order history will appear here once you make a purchase.
                </p>
              </div>
            ) : (
              <Table>
                <Table.Head>
                  <Table.Header>Order Number</Table.Header>
                  <Table.Header>Book</Table.Header>
                  <Table.Header>Quantity</Table.Header>
                  <Table.Header>Amount</Table.Header>
                  <Table.Header>Date</Table.Header>
                  <Table.Header>Status</Table.Header>
                </Table.Head>
                <Table.Body>
                  {transactions.map((transaction) => (
                    <Table.Row key={transaction.id}>
                      <Table.Cell className="font-medium text-gray-900">
                        {transaction.order_number}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center">
                          {transaction.book?.cover_photo ? (
                            <img
                              src={transaction.book.cover_photo}
                              alt={transaction.book.title}
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                              <FiBook className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{transaction.book?.title}</p>
                            <p className="text-sm text-gray-500">{transaction.book?.author?.name}</p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{transaction.quantity}</Table.Cell>
                      <Table.Cell className="font-medium text-green-600">
                        {formatCurrency(transaction.total_amount)}
                      </Table.Cell>
                      <Table.Cell>{formatDate(transaction.created_at)}</Table.Cell>
                      <Table.Cell>
                        {getStatusBadge(transaction)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerTransactions;