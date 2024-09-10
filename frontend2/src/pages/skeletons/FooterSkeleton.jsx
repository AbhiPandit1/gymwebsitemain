// FooterSkeleton.js
import React from 'react';

const FooterSkeleton = () => {
  return (
    <div className="flex flex-col gap-10 h-[85vh] p-2 sm:p-10 w-full bg-gray-800">
      {/* First Division Skeleton */}
      <div className="flex flex-col sm:flex sm:flex-row justify-between">
        <div className="mt-20 mb-10 sm:m-20 bg-gray-600 w-1/3 h-12 rounded-md animate-pulse"></div>
        <div className="bg-gray-600 h-10 w-2/3 rounded-md animate-pulse"></div>
      </div>

      {/* Second Division Skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-10">
        <div className="ml-5 sm:ml-20 flex flex-col gap-4">
          <div className="bg-gray-600 h-12 w-12 rounded-full animate-pulse"></div>
          <div className="bg-gray-600 h-12 w-12 rounded-full animate-pulse"></div>
          <div className="bg-gray-600 h-12 w-12 rounded-full animate-pulse"></div>
          <div className="bg-gray-600 h-6 w-1/2 rounded-md mt-10 animate-pulse"></div>
        </div>

        {/* Data Content Skeleton */}
        <div className="flex justify-between sm:w-[40vw] font-extrabold">
          <div>
            <div className="mt-10 flex flex-col">
              <div className="bg-gray-600 h-10 w-48 rounded-md mt-2 animate-pulse"></div>
              <div className="bg-gray-600 h-10 w-48 rounded-md mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSkeleton;
