import React from 'react';
import Skeleton from 'react-loading-skeleton'; // Import the Skeleton component
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton styles

const LoginSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 min-h-screen overflow-auto bg-primary py-10 px-4 sm:px-10">
      <div className="flex flex-col pt-8 gap-6 sm:gap-8">
        <div className="w-32 h-8 mb-4">
          <Skeleton width={128} height={32} />
        </div>

        <div className="flex flex-col sm:ml-20">
          <label className="text-white text-lg font-semibold">
            Email
          </label>
          <div className="relative">
            <Skeleton height={48} />
          </div>
        </div>

        <div className="flex flex-col sm:ml-20">
          <label className="text-white text-lg font-semibold">
            Password
          </label>
          <div className="relative">
            <Skeleton height={48} />
          </div>
        </div>

        <div className="flex flex-col sm:ml-20">
          <div className="flex items-center gap-2">
            <Skeleton circle height={24} width={24} />
            <Skeleton width={200} height={24} />
          </div>
        </div>

        <div className="flex flex-col sm:ml-20">
          <Skeleton width={200} height={48} />
        </div>

        <div className="flex justify-center sm:ml-20">
          <Skeleton width={250} height={24} />
        </div>
      </div>

      <div className="hidden sm:flex items-center justify-center">
        <Skeleton className="object-cover w-full h-full" />
      </div>
    </div>
  );
};

export default LoginSkeleton;
