import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      isLoading: false
    };
    
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
    this.formRef = React.createRef();
  }
  
  handleSubmit = async (e) => {
    e.preventDefault();
    
    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;
    
    // Basic validation
    if (!username || !password) {
      this.setState({ errorMessage: 'Please enter both username and password' });
      return;
    }
    
    this.setState({ isLoading: true, errorMessage: '' });
    
    try {
      const { login } = this.props.auth;
      const response = await login(username, password);
      
      if (response.streak_points_earned > 0) {
        alert(`Congratulations! You've earned ${response.streak_points_earned} points for your streak!`);
      }
      
      // Navigate on success
      this.props.navigate(this.props.from);
      
    } catch (error) {
      console.error('Login failed:', error);
      this.setState({ 
        errorMessage: 'Invalid credentials. Please check your username and password.',
        isLoading: false
      });
      this.passwordRef.current.value = '';
    }
  };
  
  render() {
    const { errorMessage, isLoading } = this.state;
    
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
            
            {errorMessage && (
              <div className="bg-red-100 border border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form ref={this.formRef} onSubmit={this.handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-sm text-gray-500">(not email)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    ref={this.usernameRef}
                    name="username"
                    type="text"
                    placeholder="Enter your username (not your email)"
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    ref={this.passwordRef}
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Wrapper component to provide hooks to class component
const LoginPageWrapper = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
  return <LoginPage auth={auth} navigate={navigate} from={from} />;
};

export default LoginPageWrapper;