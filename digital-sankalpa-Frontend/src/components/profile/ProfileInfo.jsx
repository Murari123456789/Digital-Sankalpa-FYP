import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';

const ProfileInfo = ({ user }) => {
  const { updateProfile } = useAuth();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    firstName: Yup.string()
      .required('First name is required'),
    lastName: Yup.string()
      .required('Last name is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  });
  
  // Handle form with Formik
  const formik = useFormik({
    initialValues: {
      username: user.username || '',
      email: user.email || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postal_code || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSuccess(null);
      setError(null);
      
      try {
        const result = await updateProfile(values);
        
        if (result.success) {
          setSuccess('Profile updated successfully!');
          // Scroll to top to show success message
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to update profile. Please try again.');
      }
    },
  });
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Profile Information</h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {typeof error === 'string' 
            ? error 
            : Object.values(error).flat().join(', ')}
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
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
          
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
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
          
          <div>
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              id="firstName"
              type="text"
              className={`input-field ${
                formik.touched.firstName && formik.errors.firstName
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
              {...formik.getFieldProps('firstName')}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              id="lastName"
              type="text"
              className={`input-field ${
                formik.touched.lastName && formik.errors.lastName
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
              {...formik.getFieldProps('lastName')}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              id="phone"
              type="tel"
              className={`input-field ${
                formik.touched.phone && formik.errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
              {...formik.getFieldProps('phone')}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              id="address"
              type="text"
              className="input-field"
              {...formik.getFieldProps('address')}
            />
          </div>
          
          <div>
            <label htmlFor="city" className="form-label">City</label>
            <input
              id="city"
              type="text"
              className="input-field"
              {...formik.getFieldProps('city')}
            />
          </div>
          
          <div>
            <label htmlFor="postalCode" className="form-label">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              className="input-field"
              {...formik.getFieldProps('postalCode')}
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;