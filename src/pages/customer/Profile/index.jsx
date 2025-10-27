import React, { useState } from 'react';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { useAuth } from '../../../hooks/useAuth';
import { formatDate } from '../../../utils/helpers';
import { FiUser, FiMail, FiLock, FiCalendar } from 'react-icons/fi';

const CustomerProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const clearMessages = () => {
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Body className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <FiUser className="w-5 h-5 mr-3" />
                      Personal Info
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'security'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <FiLock className="w-5 h-5 mr-3" />
                      Security
                    </div>
                  </button>
                </nav>
              </Card.Body>
            </Card>

            {/* Account Summary */}
            <Card className="mt-6">
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Account Summary</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Role:</span>
                    <span className="ml-2 font-medium capitalize">{user?.role}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Member Since:</span>
                    <span className="ml-2 font-medium">
                      {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active Account
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <ProfileInfoTab 
                user={user} 
                onUpdate={updateProfile}
                onSuccess={setSuccess}
                onError={setError}
              />
            )}
            
            {activeTab === 'security' && (
              <SecurityTab 
                onChangePassword={changePassword}
                onSuccess={setSuccess}
                onError={setError}
                onShowModal={() => setShowPasswordModal(true)}
              />
            )}
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onChangePassword={changePassword}
          onSuccess={(message) => {
            setSuccess(message);
            setShowPasswordModal(false);
            clearMessages();
          }}
          onError={(message) => {
            setError(message);
            clearMessages();
          }}
        />
      </div>
    </CustomerLayout>
  );
};

// Profile Information Tab
const ProfileInfoTab = ({ user, onUpdate, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(formData);
      onSuccess('Profile updated successfully');
    } catch (error) {
      onError(error.response?.data?.message || 'Failed to update profile');
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
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Update your personal details</p>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit" variant="primary" loading={loading}>
              Update Profile
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setFormData({
                name: user?.name || '',
                email: user?.email || ''
              })}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

// Security Tab
const SecurityTab = ({ onShowPassword }) => {
  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="text-sm text-gray-600">Manage your password and security preferences</p>
      </Card.Header>
      <Card.Body>
        <div className="space-y-6 max-w-2xl">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900">Password</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Last changed: Recently
                </p>
              </div>
              <Button variant="primary" onClick={onShowPassword}>
                Change Password
              </Button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Security Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use a strong, unique password</li>
              <li>• Don't reuse passwords across different sites</li>
              <li>• Consider using a password manager</li>
              <li>• Enable two-factor authentication if available</li>
            </ul>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Change Password Modal
const ChangePasswordModal = ({ isOpen, onClose, onChangePassword, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onChangePassword(formData);
      onSuccess('Password changed successfully');
      setFormData({
        current_password: '',
        password: '',
        password_confirmation: ''
      });
    } catch (error) {
      onError(error.response?.data?.message || 'Failed to change password');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Current Password
          </label>
          <Input
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            New Password
          </label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters long
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Confirm New Password
          </label>
          <Input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
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
            Change Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerProfile;