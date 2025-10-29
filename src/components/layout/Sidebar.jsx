import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

// Import icons dari react-icons
import { 
  FiHome, 
  FiBook, 
  FiUsers, 
  FiTag, 
  FiShoppingCart, 
  FiUser,
  FiBarChart2
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, user } = useAuth();

  const adminMenuItems = [
    { 
      path: ROUTES.ADMIN_DASHBOARD, 
      label: 'Dashboard', 
      icon: <FiBarChart2 className="w-5 h-5" /> 
    },
    { 
      path: ROUTES.ADMIN_BOOKS, 
      label: 'Books', 
      icon: <FiBook className="w-5 h-5" /> 
    },
    { 
      path: ROUTES.ADMIN_AUTHORS, 
      label: 'Authors', 
      icon: <FiUsers className="w-5 h-5" /> 
    },
    { 
      path: ROUTES.ADMIN_GENRES, 
      label: 'Genres', 
      icon: <FiTag className="w-5 h-5" /> 
    },
    { 
      path: ROUTES.ADMIN_TRANSACTIONS, 
      label: 'Transactions', 
      icon: <FiShoppingCart className="w-5 h-5" /> 
    },
  ];

  const customerMenuItems = [
    { 
      path: ROUTES.CUSTOMER_DASHBOARD, 
      label: 'Dashboard', 
      icon: <FiHome className="w-5 h-5" /> 
    },
    { 
      path: ROUTES.CUSTOMER_BOOKS, 
      label: 'Books', 
      icon: <FiBook className="w-5 h-5" /> 
    },
    { 
      path: ROUTES.CUSTOMER_AUTHORS, 
      label: 'Authors', 
      icon: <FiUsers className="w-5 h-5" /> 
    },
    { 
      path: ROUTES.CUSTOMER_TRANSACTIONS, 
      label: 'My Orders', 
      icon: <FiShoppingCart className="w-5 h-5" /> 
    },
    { 
      path: ROUTES.CUSTOMER_PROFILE, 
      label: 'Profile', 
      icon: <FiUser className="w-5 h-5" /> 
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  const baseLinkClasses = "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors group";
  const activeLinkClasses = "bg-blue-50 text-blue-600 border-r-2 border-blue-600";

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:inset-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <FiBook className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {isAdmin ? 'Admin BookSales' : 'BookSales'}
              </h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`
                }
                onClick={onClose}
              >
                <div className={`mr-3 transition-colors ${
                  window.location.pathname === item.path 
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;