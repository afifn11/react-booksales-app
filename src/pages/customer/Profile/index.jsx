import React from 'react';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import ProfileForm from '../../../components/forms/ProfileForm';
import { useAuth } from '../../../hooks/useAuth';

const CustomerProfile = () => {
  const { user, updateProfile } = useAuth();

  const handleProfileUpdate = async (formData) => {
    try {
      await updateProfile(formData);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              </Card.Header>
              <Card.Body>
                <ProfileForm user={user} onSubmit={handleProfileUpdate} />
              </Card.Body>
            </Card>
          </div>

          {/* Account Summary */}
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Account Summary</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">January 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="font-medium">5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerProfile;