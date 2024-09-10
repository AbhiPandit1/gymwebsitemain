import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS for default styling

const HeaderSkeleton = () => {
  return (
    <div className="flex justify-between items-center p-4 w-full h-30 rounded-l-[1.2rem] rounded-r-[1.2rem] shadow-lg bg-transparent">
      {/* Logo Placeholder */}
      <div>
        <Skeleton width={120} height={40} />
      </div>

      {/* Navigation Menu Placeholder */}
      <div className="hidden sm:flex justify-center items-center gap-2 w-full">
        <div className="flex justify-around items-center font-extrabold opacity-95 gap-2 w-[90%] h-[3rem] mx-auto rounded-lg shadow-lg">
          <Skeleton width={100} height={30} count={3} />
        </div>
        <div className="flex gap-2">
          <Skeleton width={80} height={30} />
          <Skeleton width={80} height={30} />
        </div>
      </div>

      {/* Menu Toggle Button Placeholder */}
      <div className="flex sm:hidden items-center">
        <div className="relative cursor-pointer">
          <Skeleton circle width={24} height={24} />
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;
