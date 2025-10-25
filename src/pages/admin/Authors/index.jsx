import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { authorService } from '../../../services/authors';
import { FiEdit2, FiTrash2, FiPlus, FiUser } from 'react-icons/fi';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (author.bio && author.bio.toLowerCase().includes(searchTerm.toLowerCase()))
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

        {/* Search and Table */}
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
                <Table.Header>Photo</Table.Header>
                <Table.Header>Name</Table.Header>
                <Table.Header>Bio</Table.Header>
                <Table.Header>Books Count</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Head>
              <Table.Body>
                {filteredAuthors.map((author) => (
                  <Table.Row key={author.id}>
                    <Table.Cell>
                      <AuthorPhoto author={author} />
                    </Table.Cell>
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
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={() => openEditModal(author)}
                        >
                          <FiEdit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="small"
                          onClick={() => openDeleteModal(author)}
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

            {filteredAuthors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No authors found.</p>
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
      </div>
    </AdminLayout>
  );
};

// Author Photo Component
const AuthorPhoto = ({ author }) => {
  if (author.photo) {
    return (
      <div className="flex-shrink-0">
        <img
          src={author.photo}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hidden">
          <FiUser className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
      <FiUser className="w-5 h-5 text-blue-600" />
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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Author">
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

export default Authors;