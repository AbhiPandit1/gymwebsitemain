import React from 'react';
import SkeletonCard from './SkeletonCard';

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-3 sm:pl-5 w-full max-h-full sm:max-h-[80vh] overflow-auto gap-4">
      {Array(6)
        .fill()
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </div>
  );
};

export default SkeletonLoader;
