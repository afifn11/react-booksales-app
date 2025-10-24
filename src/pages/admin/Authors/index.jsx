import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { authorService } from '../../../services/authors';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const response = await authorService.getAuthors();
      setAuthors(response.data || []);
    } catch (error) {
      console.error('Failed to load authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (author.bio && author.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            Add Author
          </Button>
        </div>

        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">All Authors</h3>
              <div className="w-64">
                <Input
                  type="text"
                  placeholder="Search authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table>
              <Table.Head>
                <Table.Header>Name</Table.Header>
                <Table.Header>Bio</Table.Header>
                <Table.Header>Books Count</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Head>
              <Table.Body>
                {filteredAuthors.map((author) => (
                  <Table.Row key={author.id}>
                    <Table.Cell className="font-medium text-gray-900">
                      {author.name}
                    </Table.Cell>
                    <Table.Cell>
                      {author.bio ? (
                        <span className="text-gray-600">
                          {author.bio.length > 100 
                            ? `${author.bio.substring(0, 100)}...` 
                            : author.bio
                          }
                        </span>
                      ) : (
                        <span className="text-gray-400">No bio</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {author.books_count || 0} books
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="small">
                          Edit
                        </Button>
                        <Button variant="danger" size="small">
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {filteredAuthors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No authors found.</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <CreateAuthorModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadAuthors}
        />
      </div>
    </AdminLayout>
  );
};

const CreateAuthorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authorService.createAuthor(formData);
      onSuccess();
      onClose();
      setFormData({ name: '', bio: '', photo: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create author');
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Author">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Author Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter author biography..."
          />
        </div>

        <Input
          label="Photo URL (Optional)"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />

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
            Create Author
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Authors;