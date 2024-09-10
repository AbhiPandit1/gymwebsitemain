import React from 'react';

const ProgrammeDetailSkeleton = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl text-white animate-pulse">
      <div className="bg-gray-700 h-60 w-full rounded-md mb-4"></div>
      <div className="bg-gray-700 h-6 w-1/2 rounded-md mb-4"></div>
      <div className="bg-gray-700 h-6 w-1/4 rounded-md mb-4"></div>
      <div className="bg-gray-700 h-8 w-1/3 rounded-md mb-4"></div>
      <div className="bg-gray-700 h-6 w-1/2 rounded-md mb-4"></div>
      <div className="flex gap-4 mb-4">
        <div className="bg-gray-700 h-10 w-1/4 rounded-md"></div>
        <div className="bg-gray-700 h-10 w-1/4 rounded-md"></div>
      </div>
      <div className="bg-gray-700 h-8 w-1/3 rounded-md"></div>
    </div>
  );
};

export default ProgrammeDetailSkeleton;
