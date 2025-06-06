import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLocation } from 'react-router-dom';
import ProfileInfo from '../components/profile/ProfileInfo';
import OrderHistory from '../components/profile/OrderHistory';
import PasswordChange from '../components/profile/PasswordChange';
import Loading from '../components/common/Loading';
import api from '../api/api';

const ProfilePage = () => {
  const { user, loading, logout, refreshUser } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  if (loading) {
    return <Loading />;
  }
  
  const handleClaimLoginStreak = async () => {
    try {
      const response = await api.post('/api/accounts/rewards/login-streak/');
      setSuccess(response.data.message);
      refreshUser(); // Refresh user data to update points and streak
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to claim reward');
    }
  };

  const handleClaimInkBottles = async () => {
    try {
      const response = await api.post('/api/accounts/rewards/ink-bottles/');
      setSuccess(response.data.message);
      refreshUser(); // Refresh user data to update points and ink bottle count
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to claim reward');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold">{user.username}</h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${
                      activeTab === 'profile'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Information
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${
                      activeTab === 'orders'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order History
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${
                      activeTab === 'password'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Change Password
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${
                      activeTab === 'rewards'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Rewards & Points
                  </button>
                </li>
                <li>
                <button
                    onClick={logout}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${
                      activeTab === 'password'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className='text-red'>                    Sign out
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {activeTab === 'profile' && <ProfileInfo user={user} />}
            {activeTab === 'orders' && <OrderHistory />}
            {activeTab === 'password' && <PasswordChange />}
            {activeTab === 'rewards' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Rewards & Points</h2>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700 mb-1">Available Points</p>
                      <p className="text-2xl font-bold text-blue-600">{user.points || 0}</p>
                      <p className="text-sm text-gray-600 mt-1">Earn 1 point for every Rs. 10 spent!</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        className="btn-primary"
                        onClick={() => alert('Coming soon!')}
                      >
                        Redeem Points
                      </button>
                      <p className="text-xs text-gray-500 text-center">Reddem while purchasing!!!</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Login Streak</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${Math.min((user.login_streak || 0) / 7 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {user.login_streak || 0}/7 days
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${i < (user.login_streak || 0) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Log in for 7 consecutive days to earn 50 bonus points!
                  </p>
                  {user.login_streak >= 7 && (
                    <button
                      onClick={handleClaimLoginStreak}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Claim 7-Day Streak Reward
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;