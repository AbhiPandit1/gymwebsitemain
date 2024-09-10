// HomeSkeleton.js
import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6 p-6 bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-300 animate-pulse rounded-lg overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col space-y-4">
        <div className="w-3/4 h-8 bg-gray-300 animate-pulse rounded-lg"></div>
        <div className="w-1/2 h-6 bg-gray-300 animate-pulse rounded-lg"></div>
        <div className="w-3/4 h-6 bg-gray-300 animate-pulse rounded-lg"></div>
      </div>

      {/* Button Section */}
      <div className="w-1/2 h-12 bg-gray-300 animate-pulse rounded-lg"></div>

      {/* Moving Cards Section */}
      <div className="space-y-4">
        <div className="h-24 bg-gray-300 animate-pulse rounded-lg"></div>
        <div className="h-24 bg-gray-300 animate-pulse rounded-lg"></div>
        <div className="h-24 bg-gray-300 animate-pulse rounded-lg"></div>
      </div>

      {/* Other Sections */}
      <div className="flex flex-col space-y-4">
        <div className="h-24 bg-gray-300 animate-pulse rounded-lg"></div>
        <div className="h-24 bg-gray-300 animate-pulse rounded-lg"></div>
        <div className="h-24 bg-gray-300 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
