import React from 'react';

const Loading = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-[#fecb02] ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Loading; 