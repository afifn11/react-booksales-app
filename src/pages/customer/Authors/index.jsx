// src/pages/customer/Authors/index.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { authorService } from '../../../services/authors';
import { FiUser, FiBook, FiSearch } from 'react-icons/fi';

const CustomerAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAuthors();
  }, [searchTerm]);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await authorService.getAuthors(params);
      setAuthors(response.data || []);
    } catch (error) {
      console.error('Failed to load authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooks = (authorId, authorName) => {
    // Navigate to books page with author filter using React Router
    navigate(`/customer/books?author_id=${authorId}&author_name=${encodeURIComponent(authorName)}`);
  };

  const AuthorCard = ({ author }) => {
    return (
      <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-center mb-4">
          {author.photo ? (
            <img
              src={author.photo}
              alt={author.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 text-gray-900">{author.name}</h3>
        
        {author.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {author.bio}
          </p>
        )}
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <FiBook className="w-4 h-4" />
          <span>{author.books_count || 0} books</span>
        </div>
        
        <Button 
          variant="outline" 
          size="small" 
          className="w-full mt-4"
          onClick={() => handleViewBooks(author.id, author.name)}
        >
          View Books
        </Button>
      </Card>
    );
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
            <p className="text-gray-600">Discover talented authors from our collection</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <Card.Body>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search authors by name or bio..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Card.Body>
        </Card>

        {/* Authors Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : authors.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-12">
              <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No authors found.</p>
              <p className="text-gray-400 mt-2">
                {searchTerm ? 'Try adjusting your search terms' : 'No authors available at the moment'}
              </p>
            </Card.Body>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerAuthors;