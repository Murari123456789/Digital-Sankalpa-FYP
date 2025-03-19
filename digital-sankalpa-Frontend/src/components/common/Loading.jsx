import React from 'react';

const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  // Determine spinner size
  const spinnerSizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16',
  };
  
  const spinnerSize = spinnerSizeClasses[size] || spinnerSizeClasses.medium;
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinner */}
      <div className={`${spinnerSize} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}></div>
      
      {/* Optional loading message */}
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
};

export default Loading;