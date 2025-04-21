import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const emailFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        const response = await axios.post('http://localhost:8000/api/accounts/forgot-password/send-otp/', {
          email: values.email,
        });
        setEmail(values.email);
        setSuccess('OTP sent successfully to your email');
        setStep(2);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to send OTP');
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        const response = await axios.post('http://localhost:8000/api/accounts/forgot-password/verify-otp/', {
          email,
          otp: values.otp,
        });
        setToken(response.data.token);
        setSuccess('OTP verified successfully');
        setStep(3);
      } catch (error) {
        setError(error.response?.data?.error || 'Invalid OTP');
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
      confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        await axios.post('http://localhost:8000/api/accounts/forgot-password/reset-password/', {
          email,
          token,
          new_password: values.password,
        });
        setSuccess('Password reset successful');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to reset password');
      }
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-10">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {error && (
          <div className="bg-red-100 border border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-500 text-green-700 p-4 mb-6 rounded">
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={emailFormik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...emailFormik.getFieldProps('email')}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  emailFormik.touched.email && emailFormik.errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {emailFormik.touched.email && emailFormik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{emailFormik.errors.email}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={otpFormik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                {...otpFormik.getFieldProps('otp')}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  otpFormik.touched.otp && otpFormik.errors.otp
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {otpFormik.touched.otp && otpFormik.errors.otp && (
                <div className="text-red-500 text-sm mt-1">{otpFormik.errors.otp}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={passwordFormik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...passwordFormik.getFieldProps('password')}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  passwordFormik.touched.password && passwordFormik.errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {passwordFormik.touched.password && passwordFormik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{passwordFormik.errors.password}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...passwordFormik.getFieldProps('confirmPassword')}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {passwordFormik.errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
