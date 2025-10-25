import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { genreService } from '../../../services/genres';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setError('Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGenre = async (genreData) => {
    try {
      await genreService.createGenre(genreData);
      setSuccess('Genre created successfully');
      loadGenres();
      setShowCreateModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create genre');
    }
  };

  const handleUpdateGenre = async (genreData) => {
    try {
      await genreService.updateGenre(selectedGenre.id, genreData);
      setSuccess('Genre updated successfully');
      loadGenres();
      setShowEditModal(false);
      setSelectedGenre(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update genre');
    }
  };

  const handleDeleteGenre = async () => {
    try {
      await genreService.deleteGenre(selectedGenre.id);
      setSuccess('Genre deleted successfully');
      loadGenres();
      setShowDeleteModal(false);
      setSelectedGenre(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete genre');
    }
  };

  const openEditModal = (genre) => {
    setSelectedGenre(genre);
    setShowEditModal(true);
    setError('');
  };

  const openDeleteModal = (genre) => {
    setSelectedGenre(genre);
    setShowDeleteModal(true);
    setError('');
  };

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (genre.description && genre.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Genres</h1>
            <p className="text-gray-600">Manage book genres in your store</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Genre
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Search and Table */}
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
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={() => openEditModal(genre)}
                        >
                          <FiEdit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="small"
                          onClick={() => openDeleteModal(genre)}
                        >
                          <FiTrash2 className="w-3 h-3 mr-1" />
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
                {searchTerm && (
                  <p className="text-gray-400 text-sm mt-1">
                    Try adjusting your search terms
                  </p>
                )}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Modals */}
        <CreateGenreModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGenre}
        />

        <EditGenreModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedGenre(null);
          }}
          genre={selectedGenre}
          onSubmit={handleUpdateGenre}
        />

        <DeleteGenreModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedGenre(null);
          }}
          genre={selectedGenre}
          onConfirm={handleDeleteGenre}
        />
      </div>
    </AdminLayout>
  );
};

// Create Genre Modal
const CreateGenreModal = ({ isOpen, onClose, onSubmit }) => {
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
      await onSubmit(formData);
      setFormData({ name: '', description: '' });
    } catch (err) {
      setError(err.message || 'Failed to create genre');
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

// Edit Genre Modal
const EditGenreModal = ({ isOpen, onClose, genre, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name || '',
        description: genre.description || ''
      });
    }
  }, [genre]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to update genre');
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

  if (!genre) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Genre">
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
            Update Genre
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Delete Genre Modal
const DeleteGenreModal = ({ isOpen, onClose, genre, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!genre) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Genre" size="small">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete genre <strong>"{genre.name}"</strong>?
        </p>
        
        {genre.books_count > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              This genre has {genre.books_count} book(s). Deleting this genre may affect these books.
            </p>
          </div>
        )}

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
            type="button"
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
          >
            Delete Genre
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Genres;