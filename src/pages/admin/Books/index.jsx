import React from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';

const Books = () => {
  const books = []; // Temporary empty array

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <Button>Add Book</Button>
        </div>

        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">All Books</h3>
              <div className="w-64">
                <Input
                  type="text"
                  placeholder="Search books..."
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table>
              <Table.Head>
                <Table.Header>Title</Table.Header>
                <Table.Header>Author</Table.Header>
                <Table.Header>Genre</Table.Header>
                <Table.Header>Price</Table.Header>
                <Table.Header>Stock</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Head>
              <Table.Body>
                {books.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-8">
                      <p className="text-gray-500">No books found.</p>
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

export default Books;