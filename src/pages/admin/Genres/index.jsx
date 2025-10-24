import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { genreService } from '../../../services/genres';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const response = await genreService.getGenres();
      setGenres(response.data || []);
    } catch (error) {
      console.error('Failed to load genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (genre.description && genre.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-gray-900">Genres</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            Add Genre
          </Button>
        </div>

        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">All Genres</h3>
              <div className="w-64">
                <Input
                  type="text"
                  placeholder="Search genres..."
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
                <Table.Header>Description</Table.Header>
                <Table.Header>Books Count</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Head>
              <Table.Body>
                {filteredGenres.map((genre) => (
                  <Table.Row key={genre.id}>
                    <Table.Cell className="font-medium text-gray-900">
                      {genre.name}
                    </Table.Cell>
                    <Table.Cell>
                      {genre.description ? (
                        <span className="text-gray-600">
                          {genre.description.length > 100 
                            ? `${genre.description.substring(0, 100)}...` 
                            : genre.description
                          }
                        </span>
                      ) : (
                        <span className="text-gray-400">No description</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {genre.books_count || 0} books
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

            {filteredGenres.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No genres found.</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <CreateGenreModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadGenres}
        />
      </div>
    </AdminLayout>
  );
};

const CreateGenreModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await genreService.createGenre(formData);
      onSuccess();
      onClose();
      setFormData({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create genre');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Genre">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Genre Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter genre description..."
          />
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
            Create Genre
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Genres;