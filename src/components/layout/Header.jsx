import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import { FiLogOut, FiMenu, FiBell, FiUser, FiBook } from 'react-icons/fi';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 mr-3 text-gray-600 rounded-lg md:hidden hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            
            <div className="relative group">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm font-medium">
                  {getInitials(user?.name || 'User')}
                </span>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    Signed in as <br />
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <FiUser className="w-4 h-4 mr-3" />
                    My Profile
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;