import React from 'react';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const CustomerBooks = () => {
  const books = []; // Temporary empty array

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
        </div>

        {/* Search and Filters */}
        <Card>
          <Card.Body>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search books..."
                className="flex-1"
              />
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-48 p-2.5">
                <option value="">All Genres</option>
              </select>
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-48 p-2.5">
                <option value="">All Authors</option>
              </select>
            </div>
          </Card.Body>
        </Card>

        {/* Books Grid */}
        {books.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-12">
              <p className="text-gray-500 text-lg">No books available at the moment.</p>
              <p className="text-gray-400 mt-2">Check back later for new arrivals!</p>
            </Card.Body>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Books will be rendered here */}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerBooks;