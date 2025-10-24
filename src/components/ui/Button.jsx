import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg text-center focus:ring-4 focus:outline-none transition-colors flex items-center justify-center';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-300 text-white',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-300 text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-300 text-white',
    outline: 'border border-gray-300 hover:bg-gray-100 focus:ring-gray-300 text-gray-900'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-5 py-2.5 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading ? (
        <>
          <FiLoader className="w-4 h-4 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;