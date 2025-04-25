import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useCart } from '../../hooks/useCart';
import { getWishlist } from '../../api/wishlist';
import { FaHeart } from 'react-icons/fa';
import Logo from '/assets/images/logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    if (user) {
      try {
        const wishlistItems = await getWishlist();
        setWishlistCount(wishlistItems.length);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchWishlistCount();

    // Add event listener for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [user]);

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Check if user is admin
  const isAdmin = user && user.isAdmin === true;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-6">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Digital Sankalpa Logo" className="h-16 w-auto" />
            </Link>
          </div>
          
          {/* Navigation - Center */}
          <nav className="hidden lg:flex flex-grow justify-center">
            <ul className="flex space-x-10 text-base font-medium">
              <li>
                <Link 
                  to="/" 
                  className={`relative px-2 py-3 ${isActivePath('/') ? 'text-blue-600 after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={`relative px-2 py-3 ${isActivePath('/products') ? 'text-blue-600 after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link 
                  to="/warranty" 
                  className={`relative px-2 py-3 ${isActivePath('/warranty') ? 'text-blue-600 after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`relative px-2 py-3 ${isActivePath('/contact') ? 'text-blue-600 after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                >
                  Contact Us
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link 
                    to="/admin" 
                    className={`relative px-2 py-3 ${isActivePath('/admin') ? 'text-blue-600 after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          {/* User Account and Cart - Right Side */}
          <div className="flex items-center gap-5">
            {/* Mobile menu button */}

            
            <Link to="/wishlist" className="relative text-gray-600 hover:text-blue-500 transition-colors duration-200">
              <FaHeart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-500 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button 
              className="lg:hidden text-gray-600 hover:text-blue-500 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            
            {user ? (
              <div className="relative group">
                <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500">Profile</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline text-sm font-medium">Sign In</span>
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/" 
                  className={`block py-2 ${isActivePath('/') ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={`block py-2 ${isActivePath('/products') ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link 
                  to="/warranty" 
                  className={`block py-2 ${isActivePath('/warranty') ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`block py-2 ${isActivePath('/contact') ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link 
                    to="/admin" 
                    className={`block py-2 ${isActivePath('/admin') ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:text-blue-500 transition-colors duration-200`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;