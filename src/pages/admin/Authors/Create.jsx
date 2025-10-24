import React from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateAuthor = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Add New Author</h1>
        </div>

        <Card>
          <Card.Body>
            <form className="space-y-6 max-w-2xl">
              <Input
                label="Author Name"
                placeholder="Enter author name"
                required
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Biography
                </label>
                <textarea
                  rows={6}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter author biography..."
                />
              </div>

              <Input
                label="Photo URL"
                placeholder="https://example.com/photo.jpg"
              />

              <div className="flex space-x-3">
                <Button type="submit" variant="primary">
                  Create Author
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateAuthor;