import React from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';

const Customers = () => {
  const customers = []; // Temporary empty array

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        </div>

        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">All Customers</h3>
              <div className="w-64">
                <Input
                  type="text"
                  placeholder="Search customers..."
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table>
              <Table.Head>
                <Table.Header>Name</Table.Header>
                <Table.Header>Email</Table.Header>
                <Table.Header>Last Access</Table.Header>
                <Table.Header>Orders</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Head>
              <Table.Body>
                {customers.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">No customers found.</p>
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

export default Customers;