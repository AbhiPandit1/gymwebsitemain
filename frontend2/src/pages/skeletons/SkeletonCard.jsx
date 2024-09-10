import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-gray-800 rounded-[10px] m-auto min-h-[400px] p-4 w-[300px] shadow-lg border-4 border-orange-600 animate-pulse">
      <div className="h-[249px] w-[320px] bg-gray-700 rounded-[10px] mb-4"></div>
      <div className="h-[2rem] max-w-[5rem] bg-gray-700 rounded-[10px] mb-4"></div>
      <div className="h-[2rem] w-[8rem] bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-[2rem] mt-2 bg-gray-700 rounded-[10px] mb-4"></div>
      <div className="font-sans text-1xl bg-gray-700 w-[90%] h-[3rem] rounded-[10px] mb-4"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-xl text-gray-500 font-sans font-bold flex justify-center items-center m-2 bg-gray-700 h-[3rem] w-[3.6rem] rounded-xl"></div>
        <div className="w-[3.6rem] h-[3.2rem] bg-gray-700 rounded-xl"></div>
      </div>
      <div className="mt-4 flex gap-4">
        <div className="bg-gray-700 h-[2rem] w-[6rem] rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
