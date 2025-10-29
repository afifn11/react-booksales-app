import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Footer from './Footer';
import { FiBook, FiUsers, FiShoppingCart, FiUser, FiLogOut, FiHome, FiHeart } from 'react-icons/fi';

const CustomerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { getCartItemsCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/customer/dashboard', icon: <FiHome className="w-4 h-4" /> },
    { name: 'Books', href: '/customer/books', icon: <FiBook className="w-4 h-4" /> },
    { name: 'Authors', href: '/customer/authors', icon: <FiUsers className="w-4 h-4" /> },
    { name: 'Wishlist', href: '/customer/wishlist', icon: <FiHeart className="w-4 h-4" /> },
    { name: 'My Orders', href: '/customer/transactions', icon: <FiShoppingCart className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/customer/dashboard" className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <FiBook className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">BookSales</span>
                </Link>
              </div>
              
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Shopping Cart */}
              <button 
                className="p-2 text-gray-600 hover:text-blue-600 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <FiShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              </button>

              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Customer</p>
                </div>
              </div>
              
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <FiUser className="w-5 h-5" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/customer/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiUser className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                    <Link
                      to="/customer/wishlist"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiHeart className="w-4 h-4 mr-3" />
                      My Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
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
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex justify-around py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex flex-col items-center px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLayout;