import React from 'react';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';

const CustomerTransactions = () => {
  const transactions = []; // Temporary empty array

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Order History</h3>
          </Card.Header>
          <Card.Body>
            <Table>
              <Table.Head>
                <Table.Header>Order Number</Table.Header>
                <Table.Header>Book</Table.Header>
                <Table.Header>Amount</Table.Header>
                <Table.Header>Date</Table.Header>
                <Table.Header>Status</Table.Header>
              </Table.Head>
              <Table.Body>
                {transactions.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">No orders found.</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Your order history will appear here once you make a purchase.
                      </p>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerTransactions;