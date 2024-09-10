import React from 'react';
import { FaArrowDown } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const CategoriesCardSkeleton = () => {
  return (
    <div className="text-white flex flex-col items-center max-w-[100%] mx-auto rounded-xl p-10 relative">
      <h1 className="text-xl sm:text-3xl text-center font-sans font-extrabold bg-gray-300 h-8 w-1/2 mb-4"></h1>

      {/* Left Button - Hidden on small screens */}
      <button
        className="absolute left-0 top-[50%] transform -translate-y-1/2 bg-gray-300 p-2 rounded-full cursor-not-allowed z-10"
        disabled
      >
        <IoIosArrowBack color="gray" className="w-6 h-6 sm:w-10 sm:h-10" />
      </button>

      {/* Card Container */}
      <div
        className="gap-4 sm:gap-8 flex overflow-x-auto mt-4 rounded-lg p-6 w-full scrollbar-hide"
        style={{ cursor: 'grab' }}
      >
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden bg-gray-300 h-[40vh] sm:min-h-[60vh] m-[2rem] max-h-[60vh] min-w-[60vw] sm:min-w-[20%] border-b-4 border-gray-400 animate-pulse"
          >
            <div className="relative max-h-full overflow-hidden rounded-lg bg-gray-200">
              <div className="w-full h-full bg-gray-400" />
              <div className="absolute inset-x-0 bottom-0 h-[64rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </div>
            <div className="absolute inset-0 flex items-end justify-center mb-2">
              <div className="font-extrabold text-2xl sm:text-4xl text-gray-300 text-center bg-gray-200 h-8 w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Button - Hidden on small screens */}
      <button
        className="absolute right-0 top-[50%] transform -translate-y-1/2 bg-gray-300 p-2 rounded-full cursor-not-allowed z-10"
        disabled
      >
        <IoIosArrowForward color="gray" className="w-6 h-6 sm:w-10 sm:h-10" />
      </button>

      <div className="flex justify-center items-center mt-4">
        <button
          className="w-12 h-12 bg-gray-300 text-gray-400 rounded-full flex items-center justify-center cursor-not-allowed"
          disabled
        >
          <FaArrowDown size={50} />
        </button>
      </div>
    </div>
  );
};

export default CategoriesCardSkeleton;
