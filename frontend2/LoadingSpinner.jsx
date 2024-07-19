import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 bg-inherit ">
      <div className="relative">
        <div className="flex items-center justify-center w-16 h-16 absolute">
          <div className="w-12 h-12 border-4 border-t-transparent border-b border-solid  rounded-full animate-spin"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className=" text-xl font-semibold text-white z-[10]">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
