import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState(null);
  
  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
      passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });
  
  // Handle form with Formik
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setRegisterError(null);
      
      try {
        const { passwordConfirm, ...userData } = values;
        const result = await register(userData);
        
        if (result.success) {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please sign in with your new account.' 
            } 
          });
        } else {
          setRegisterError(result.error);
        }
      } catch (err) {
        setRegisterError('Registration failed. Please try again.');
      }
    },
  });
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        
        {registerError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {typeof registerError === 'string' 
              ? registerError 
              : Object.values(registerError).flat().join(', ')}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              className={`input-field ${
                formik.touched.username && formik.errors.username
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
              {...formik.getFieldProps('username')}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`input-field ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              className={`input-field ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
            <input
              id="passwordConfirm"
              type="password"
              placeholder="Confirm your password"
              className={`input-field ${
                formik.touched.passwordConfirm && formik.errors.passwordConfirm
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
              {...formik.getFieldProps('passwordConfirm')}
            />
            {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.passwordConfirm}</div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="w-full btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;