import React from 'react';

const TrainerProfileSkeleton = () => {
  return (
    <div className="grid grid-cols-7 min-h-screen max-w-full text-white font-sans  bg-gray-900">
      {/* Sidebar Skeleton */}
      <div className="col-span-2 bg-gray-800 p-6">
        <div className="h-12 bg-gray-700 mb-6 rounded-lg"></div>
        <div className="h-12 bg-gray-700 mb-6 rounded-lg"></div>
        <div className="h-12 bg-gray-700 mb-6 rounded-lg"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="col-span-5 p-8">
        {/* Dashboard Header Skeleton */}
        <div className="h-16 bg-gray-700 mb-6 rounded-lg"></div>

        {/* Trainer Info Skeleton */}
        <div className="relative p-8 bg-gray-800 rounded-lg shadow-lg m-4">
          <div className="absolute inset-0 bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="relative flex items-center z-10">
            <div className="w-32 h-32 flex-shrink-0 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="ml-6">
              <div className="w-48 h-8 bg-gray-700 mb-2 rounded-lg animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-700 mb-4 rounded-lg animate-pulse"></div>
              <div className="w-36 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Programme List Skeleton */}
        <div className="mt-8 mx-5">
          <div className="w-48 h-8 bg-gray-700 mb-4 rounded-lg animate-pulse"></div>
          <ul>
            {[...Array(3)].map((_, idx) => (
              <li
                key={idx}
                className="p-4 mb-4 bg-gray-800 rounded-lg shadow-lg animate-pulse"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 bg-gray-700 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="w-48 h-6 bg-gray-700 mb-2 rounded-lg animate-pulse"></div>
                    <div className="w-64 h-4 bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="w-24 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* Review Form Skeleton (if user is logged in) */}
        <div className="mt-8 mx-5">
          <div className="w-full h-12 bg-gray-700 mb-4 rounded-lg animate-pulse"></div>
          <div className="w-full h-40 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfileSkeleton;
