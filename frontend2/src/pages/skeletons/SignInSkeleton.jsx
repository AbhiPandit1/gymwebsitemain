import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SignInSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 min-h-screen overflow-auto bg-primary py-10 px-4 sm:px-10">
      <div className="flex flex-col pt-8 gap-6 sm:gap-8">
        <div className="w-36 h-12 bg-gray-300 rounded-full mb-6"></div>

        <div className="flex flex-col sm:ml-20">
          <label className="text-white text-lg font-semibold">
            Email
          </label>
          <div className="relative">
            <Skeleton
              className="w-full sm:w-4/5 text-white bg-tertiary h-12 sm:h-12 rounded-full pl-12"
              height={48}
            />
          </div>
        </div>

        <div className="flex flex-col sm:ml-20">
          <label className="text-white text-lg font-semibold">
            Password
          </label>
          <div className="relative">
            <Skeleton
              className="w-full sm:w-4/5 text-white bg-tertiary h-12 sm:h-12 rounded-full pl-12"
              height={48}
            />
          </div>
        </div>

        <div className="flex flex-col sm:ml-20">
          <label className="text-white text-lg font-semibold">
            Confirm Password
          </label>
          <div className="relative">
            <Skeleton
              className="w-full sm:w-4/5 text-white bg-tertiary h-12 sm:h-12 rounded-full pl-12"
              height={48}
            />
          </div>
        </div>

        <div className="flex flex-col sm:ml-20">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 bg-gray-300 rounded-full" />
            <div className="flex flex-col">
              <Skeleton className="w-60 h-6 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:ml-20">
          <button
            type="button"
            className="w-full sm:w-4/5 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold"
          >
            <Skeleton className="w-full h-full" />
          </button>
        </div>

        <div className="flex justify-center sm:ml-20">
          <Skeleton className="w-64 h-6 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div className="hidden sm:flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
};

export default SignInSkeleton;
