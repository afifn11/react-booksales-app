  // src/pages/admin/Genres/index.jsx

  import React, { useState, useEffect } from 'react';
  import AdminLayout from '../../../components/layout/AdminLayout';
  import Card from '../../../components/ui/Card';
  import Button from '../../../components/ui/Button';
  import Table from '../../../components/ui/Table';
  import Input from '../../../components/ui/Input';
  import Modal from '../../../components/ui/Modal';
  import LoadingSpinner from '../../../components/ui/LoadingSpinner';
  import { genreService } from '../../../services/genres';
  import { 
    FiEdit2, 
    FiTrash2, 
    FiPlus, 
    FiTag,
    FiSearch,
    FiFilter,
    FiEye
  } from 'react-icons/fi';

  const Genres = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [filters, setFilters] = useState({
      search: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
      loadGenres();
    }, [filters]);

    const loadGenres = async () => {
      try {
        setLoading(true);
        const response = await genreService.getGenres(filters);
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

    const openDetailModal = (genre) => {
      setSelectedGenre(genre);
      setShowDetailModal(true);
    };

    const handleFilterChange = (key, value) => {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    };

    const clearFilters = () => {
      setFilters({
        search: '',
        sort_by: 'created_at',
        sort_order: 'desc'
      });
    };

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

    if (loading && genres.length === 0) {
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

          {/* Filters */}
          <Card>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search genres..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2"></div> {/* Spacer */}

                <div className="flex space-x-2">
                  <select
                    value={filters.sort_by}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="created_at">Newest</option>
                    <option value="name">Name</option>
                    <option value="books_count">Books Count</option>
                  </select>
                  <Button variant="outline" onClick={clearFilters}>
                    <FiFilter className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Genres Table */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  All Genres ({genres.length})
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              {genres.length === 0 ? (
                <div className="text-center py-8">
                  <FiTag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No genres found.</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {filters.search 
                      ? 'Try adjusting your filters' 
                      : 'Get started by adding your first genre'
                    }
                  </p>
                </div>
              ) : (
                <Table>
                  <Table.Head>
                    <Table.Header>Icon</Table.Header>
                    <Table.Header>Name</Table.Header>
                    <Table.Header>Description</Table.Header>
                    <Table.Header>Books Count</Table.Header>
                    <Table.Header>Actions</Table.Header>
                  </Table.Head>
                  <Table.Body>
                    {genres.map((genre) => (
                      <Table.Row key={genre.id}>
                        <Table.Cell>
                          <GenreIcon genre={genre} />
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <p className="font-medium text-gray-900">{genre.name}</p>
                          </div>
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
                              onClick={() => openDetailModal(genre)}
                            >
                              <FiEye className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => openEditModal(genre)}
                            >
                              <FiEdit2 className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="small"
                              onClick={() => openDeleteModal(genre)}
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
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

          <GenreDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedGenre(null);
            }}
            genre={selectedGenre}
          />
        </div>
      </AdminLayout>
    );
  };

  // Genre Icon Component
  const GenreIcon = ({ genre }) => {
    return (
      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
        <FiTag className="w-5 h-5 text-green-600" />
      </div>
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
      <Modal isOpen={isOpen} onClose={onClose} title="Add New Genre" size="large">
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
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Genre" size="large">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Current Genre Icon */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Current Icon
            </label>
            <div className="flex items-center space-x-4">
              <GenreIcon genre={genre} />
              <div className="text-sm text-gray-600">
                <p>Genre icon preview</p>
              </div>
            </div>
          </div>

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
          <div className="flex items-center space-x-3">
            <GenreIcon genre={genre} />
            <div>
              <p className="text-gray-600">
                Are you sure you want to delete genre <strong>"{genre.name}"</strong>?
              </p>
            </div>
          </div>
          
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

  // Genre Detail Modal Component
  const GenreDetailModal = ({ isOpen, onClose, genre }) => {
    if (!genre) return null;

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Genre Details" size="medium">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiTag className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{genre.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 w-20">Books:</span>
                  <span className="font-medium bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs">
                    {genre.books_count || 0} books
                  </span>
                </div>
              </div>
            </div>
          </div>

          {genre.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{genre.description}</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  export default Genres;
