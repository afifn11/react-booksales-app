// src/pages/admin/Authors/index.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { authorService } from '../../../services/authors';
import { 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiUser,
  FiSearch,
  FiFilter,
  FiEye
} from 'react-icons/fi';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAuthors();
  }, [filters]);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const response = await authorService.getAuthors(filters);
      setAuthors(response.data || []);
    } catch (error) {
      console.error('Failed to load authors:', error);
      setError('Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuthor = async (authorData) => {
    try {
      await authorService.createAuthor(authorData);
      setSuccess('Author created successfully');
      loadAuthors();
      setShowCreateModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create author');
    }
  };

  const handleUpdateAuthor = async (authorData) => {
    try {
      await authorService.updateAuthor(selectedAuthor.id, authorData);
      setSuccess('Author updated successfully');
      loadAuthors();
      setShowEditModal(false);
      setSelectedAuthor(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update author');
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      await authorService.deleteAuthor(selectedAuthor.id);
      setSuccess('Author deleted successfully');
      loadAuthors();
      setShowDeleteModal(false);
      setSelectedAuthor(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete author');
    }
  };

  const openEditModal = (author) => {
    setSelectedAuthor(author);
    setShowEditModal(true);
    setError('');
  };

  const openDeleteModal = (author) => {
    setSelectedAuthor(author);
    setShowDeleteModal(true);
    setError('');
  };

  const openDetailModal = (author) => {
    setSelectedAuthor(author);
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

  if (loading && authors.length === 0) {
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
            <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
            <p className="text-gray-600">Manage book authors in your store</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Author
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
                  placeholder="Search authors..."
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

        {/* Authors Table */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                All Authors ({authors.length})
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            {authors.length === 0 ? (
              <div className="text-center py-8">
                <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No authors found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  {filters.search 
                    ? 'Try adjusting your filters' 
                    : 'Get started by adding your first author'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <Table.Head>
                  <Table.Header>Photo</Table.Header>
                  <Table.Header>Name</Table.Header>
                  <Table.Header>Bio</Table.Header>
                  <Table.Header>Books Count</Table.Header>
                  <Table.Header>Actions</Table.Header>
                </Table.Head>
                <Table.Body>
                  {authors.map((author) => (
                    <Table.Row key={author.id}>
                      <Table.Cell>
                        <AuthorPhoto author={author} />
                      </Table.Cell>
                      <Table.Cell>
                        <div>
                          <p className="font-medium text-gray-900">{author.name}</p>
                        </div>
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
                          <Button 
                            variant="outline" 
                            size="small"
                            onClick={() => openDetailModal(author)}
                          >
                            <FiEye className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="small"
                            onClick={() => openEditModal(author)}
                          >
                            <FiEdit2 className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="danger" 
                            size="small"
                            onClick={() => openDeleteModal(author)}
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
        <CreateAuthorModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAuthor}
        />

        <EditAuthorModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAuthor(null);
          }}
          author={selectedAuthor}
          onSubmit={handleUpdateAuthor}
        />

        <DeleteAuthorModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAuthor(null);
          }}
          author={selectedAuthor}
          onConfirm={handleDeleteAuthor}
        />

        <AuthorDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAuthor(null);
          }}
          author={selectedAuthor}
        />
      </div>
    </AdminLayout>
  );
};

// Author Photo Component
const AuthorPhoto = ({ author }) => {
  if (author.photo) {
    return (
      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={author.photo}
          alt={author.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center hidden">
          <FiUser className="w-6 h-6 text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center">
      <FiUser className="w-6 h-6 text-blue-600" />
    </div>
  );
};

// Create Author Modal
const CreateAuthorModal = ({ isOpen, onClose, onSubmit }) => {
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
      await onSubmit(formData);
      setFormData({ name: '', bio: '', photo: '' });
    } catch (err) {
      setError(err.message || 'Failed to create author');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Author" size="large">
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

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Photo URL
          </label>
          <Input
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a valid image URL. If no URL is provided, a default avatar will be used.
          </p>
        </div>

        {/* Photo Preview */}
        {formData.photo && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">Photo Preview:</p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center hidden">
                  <FiUser className="w-6 h-6 text-gray-500" />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Image preview will appear here</p>
                <p className="text-xs text-gray-500">Make sure the URL is accessible</p>
              </div>
            </div>
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

// Edit Author Modal
const EditAuthorModal = ({ isOpen, onClose, author, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name || '',
        bio: author.bio || '',
        photo: author.photo || ''
      });
    }
  }, [author]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to update author');
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

  if (!author) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Author" size="large">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Current Photo Preview */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Current Photo
          </label>
          <div className="flex items-center space-x-4">
            <AuthorPhoto author={author} />
            <div className="text-sm text-gray-600">
              <p>Current author photo</p>
            </div>
          </div>
        </div>

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

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Photo URL
          </label>
          <Input
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a valid image URL. Leave empty to use default avatar.
          </p>
        </div>

        {/* New Photo Preview */}
        {formData.photo && formData.photo !== author.photo && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">New Photo Preview:</p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center hidden">
                  <FiUser className="w-6 h-6 text-gray-500" />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>New image preview</p>
                <p className="text-xs text-gray-500">Make sure the URL is accessible</p>
              </div>
            </div>
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
            type="submit"
            variant="primary"
            loading={loading}
          >
            Update Author
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Delete Author Modal
const DeleteAuthorModal = ({ isOpen, onClose, author, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!author) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Author" size="small">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <AuthorPhoto author={author} />
          <div>
            <p className="text-gray-600">
              Are you sure you want to delete author <strong>"{author.name}"</strong>?
            </p>
          </div>
        </div>
        
        {author.books_count > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              This author has {author.books_count} book(s). Deleting this author may affect these books.
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
            Delete Author
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Author Detail Modal Component
const AuthorDetailModal = ({ isOpen, onClose, author }) => {
  if (!author) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Author Details" size="medium">
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            {author.photo ? (
              <img
                src={author.photo}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                <FiUser className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{author.name}</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-600 w-20">Books:</span>
                <span className="font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs">
                  {author.books_count || 0} books
                </span>
              </div>
            </div>
          </div>
        </div>

        {author.bio && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Biography</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{author.bio}</p>
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

export default Authors;