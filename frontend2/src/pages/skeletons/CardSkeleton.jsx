import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="relative">
      <h1 className="text-gray-300 font-extrabold text-[40px] sm:text-[48px] mt-10 sm:mt-20 border-b-2 border-gray-500 text-center">
        Loading...
      </h1>

      {/* Left Button Skeleton */}
      <div className="hidden sm:block absolute left-0 top-[50%] transform -translate-y-1/2 bg-gray-300 p-2 rounded-full">
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gray-400 rounded-full"></div>
      </div>

      {/* Card Container Skeleton */}
      <div className="overflow-x-auto w-full max-w-[95%] mx-auto mt-4 cursor-not-allowed scrollbar-hide">
        <div className="flex transition-transform duration-300 ease-in-out">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 rounded-[2px] m-[4rem] p-4 h-[400px] border-y-2 flex-shrink-0 border-b-4 border-gray-400 animate-pulse"
              style={{ minWidth: `calc(100% / 3)` }}
            >
              <div className="h-[300px] w-[400px] bg-gray-400 rounded-[12px]"></div>
              <div className="p-4 flex justify-between flex-col sm:flex-row">
                <div className="w-24 h-6 bg-gray-400 rounded"></div>
                <div className="w-24 h-6 bg-gray-400 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Button Skeleton */}
      <div className="hidden sm:block absolute right-0 top-[50%] transform -translate-y-1/2 bg-gray-300 p-2 rounded-full">
        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
