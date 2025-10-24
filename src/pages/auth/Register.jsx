import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../../components/forms/RegisterForm';
import Card from '../../components/ui/Card';

const Register = () => {
  const { register, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && user) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');

    try {
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join BookSales today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <RegisterForm onSubmit={handleRegister} loading={loading} />
        </Card>
      </div>
    </div>
  );
};

export default Register;