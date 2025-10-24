import React from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';

const Transactions = () => {
  const transactions = []; // Temporary empty array

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        </div>

        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">All Transactions</h3>
              <div className="w-64">
                <Input
                  type="text"
                  placeholder="Search transactions..."
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table>
              <Table.Head>
                <Table.Header>Order Number</Table.Header>
                <Table.Header>Customer</Table.Header>
                <Table.Header>Book</Table.Header>
                <Table.Header>Amount</Table.Header>
                <Table.Header>Date</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Head>
              <Table.Body>
                {transactions.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-8">
                      <p className="text-gray-500">No transactions found.</p>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Transactions;