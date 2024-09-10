import React from 'react';
import { IoIosArrowRoundDown } from 'react-icons/io';

const HeroSectionSkeleton = () => {
  return (
    <div className="relative w-[100vw] h-[60vh] sm:h-[80vh] overflow-hidden">
      <div className="w-full h-full bg-gray-300 animate-pulse">
        <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="absolute flex justify-between items-center w-[100vw] z-10">
          <div className="w-[20%] h-[3rem] bg-gray-400 rounded-md animate-pulse" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div className="absolute top-1/2 transform -translate-y-1/2 w-full p-[10%] flex flex-col gap-5">
          <div className="w-[40%] h-[4rem] bg-gray-400 rounded-md animate-pulse" />
          <div className="w-[80%] sm:w-[50%] h-[3rem] bg-gray-400 rounded-md animate-pulse" />
          <div className="flex justify-start items-center right-0">
            <button className="h-[3.5rem] w-[16rem] flex justify-center items-center bg-gray-400 text-white rounded-sm animate-pulse">
              <span className="w-[70%] h-[1rem] bg-gray-300 rounded-md animate-pulse" />
              <IoIosArrowRoundDown color="white" size={30} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionSkeleton;
