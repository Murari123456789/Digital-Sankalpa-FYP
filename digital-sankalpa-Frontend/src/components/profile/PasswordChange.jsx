import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';

const PasswordChange = () => {
  const { changePassword } = useAuth();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // Form validation schema
  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your new password'),
  });
  
  // Handle form with Formik
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSuccess(null);
      setError(null);
      
      try {
        const result = await changePassword({
          old_password: values.oldPassword,
          new_password: values.newPassword,
        });
        
        if (result.success) {
          setSuccess('Password changed successfully!');
          formik.resetForm();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to change password. Please try again.');
      }
    },
  });
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      
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
      
      <form onSubmit={formik.handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="oldPassword" className="form-label">Current Password</label>
          <input
            id="oldPassword"
            type="password"
            className={`input-field ${
              formik.touched.oldPassword && formik.errors.oldPassword
                ? 'border-red-500 focus:ring-red-500'
                : ''
            }`}
            {...formik.getFieldProps('oldPassword')}
          />
          {formik.touched.oldPassword && formik.errors.oldPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.oldPassword}</div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            id="newPassword"
            type="password"
            className={`input-field ${
              formik.touched.newPassword && formik.errors.newPassword
                ? 'border-red-500 focus:ring-red-500'
                : ''
            }`}
            {...formik.getFieldProps('newPassword')}
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            className={`input-field ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? 'border-red-500 focus:ring-red-500'
                : ''
            }`}
            {...formik.getFieldProps('confirmPassword')}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            className="btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 border-t pt-6">
        <h3 className="font-semibold mb-2">Password Requirements</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li>At least 8 characters long</li>
          <li>Must contain at least one uppercase letter</li>
          <li>Must contain at least one lowercase letter</li>
          <li>Must contain at least one number</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordChange;