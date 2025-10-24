import React from 'react';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';

const CustomerAuthors = () => {
  const authors = []; // Temporary empty array

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
        </div>

        {/* Search */}
        <Card>
          <Card.Body>
            <Input
              placeholder="Search authors..."
            />
          </Card.Body>
        </Card>

        {/* Authors Grid */}
        {authors.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-12">
              <p className="text-gray-500 text-lg">No authors found.</p>
            </Card.Body>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Authors will be rendered here */}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerAuthors;