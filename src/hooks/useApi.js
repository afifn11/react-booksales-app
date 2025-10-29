import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// instance axios untuk useApi hook
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
});

// interceptor untuk token
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiInstance({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    request,
  };
};