import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 border-b">
          <div className="flex gap-4 text-sm text-gray-600">
            {user ? (
              <>
                <button onClick={logout} className="hover:text-blue-500">Sign Out</button>
                <span>|</span>
                <Link to="/profile" className="hover:text-blue-500">My Account</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-500">Sign In</Link>
                <span>|</span>
                <Link to="/register" className="hover:text-blue-500">Create an Account</Link>
              </>
            )}
            <span>|</span>
            <Link to="/contact" className="hover:text-blue-500">Contact Us</Link>
          </div>
          <div>
            <Link to="/warranty" className="text-blue-500 text-sm hover:underline">
              Extended Warranty
            </Link>
          </div>
        </div>
        
        {/* Main Header */}
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-gray-800 font-bold text-xl">
            Digital Sankalpa
          </Link>
          
          <div className="flex items-center w-1/2">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative inline-block w-32">
                <select className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-l leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
                  <option>All Categories</option>
                  <option>Printers</option>
                  <option>Accessories</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 border-t border-b border-gray-300 py-2 px-3 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-gray-500">CALL US NOW</div>
              <div className="font-semibold">9851060000</div>
            </div>
            
            <Link to="/profile" className="text-gray-600 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            
            <Link to="/wishlist" className="text-gray-600 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="py-3 border-t">
          <ul className="flex space-x-6 text-sm">
            <li>
              <Link to="/products" className="text-blue-500 hover:underline">All Products</Link>
            </li>
            <li>
              <Link to="/sales" className="text-gray-600 hover:text-blue-500">Sale</Link>
            </li>
            <li>
              <Link to="/locations" className="text-gray-600 hover:text-blue-500">Locations</Link>
            </li>
            <li>
              <Link to="/warranty" className="text-gray-600 hover:text-blue-500">Warranty</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-blue-500">Contact</Link>
            </li>
            {user && user.isAdmin && (
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-blue-500">Admin Dashboard</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;