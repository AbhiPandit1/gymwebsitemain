import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoginSkeleton = () => {
  const backgroundStyle = {
    background: 'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 min-h-screen overflow-auto py-10 px-4 sm:px-10" style={backgroundStyle}>
      <div className="flex flex-col pt-8 gap-6 sm:gap-8">
        {/* Logo Skeleton */}
        <div className="w-32 h-8 mb-4">
          <Skeleton width={128} height={32} baseColor="#172438" highlightColor="#30507A"/>
        </div>

        {/* Email Field Skeleton */}
        <div className="flex flex-col sm:ml-20">
          <div className="mb-2">
            <Skeleton width={80} height={24} baseColor="#172438" highlightColor="#30507A"/>
          </div>
          <div className="relative">
            <Skeleton height={48} className="rounded-full" baseColor="#172438" highlightColor="#30507A"/>
          </div>
        </div>

        {/* Password Field Skeleton */}
        <div className="flex flex-col sm:ml-20">
          <div className="mb-2">
            <Skeleton width={100} height={24} baseColor="#172438" highlightColor="#30507A"/>
          </div>
          <div className="relative">
            <Skeleton height={48} className="rounded-full" baseColor="#172438" highlightColor="#30507A"/>
          </div>
        </div>

        {/* Terms Checkbox Skeleton */}
        <div className="flex flex-col sm:ml-20">
          <div className="flex items-center gap-2">
            <Skeleton circle height={24} width={24} baseColor="#172438" highlightColor="#30507A"/>
            <Skeleton width={200} height={24} baseColor="#172438" highlightColor="#30507A"/>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="flex flex-col sm:ml-20">
          <Skeleton 
            width="80%" 
            height={48} 
            className="rounded-full" 
            baseColor="#172438" 
            highlightColor="#30507A"
          />
        </div>

        {/* Links Skeleton */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton 
            width={200} 
            height={24} 
            baseColor="#172438" 
            highlightColor="#30507A"
          />
          <Skeleton 
            width={150} 
            height={24} 
            baseColor="#172438" 
            highlightColor="#30507A"
          />
        </div>
      </div>

      {/* Right side image skeleton */}
      <div className="hidden sm:flex items-center justify-center">
        <Skeleton 
          className="w-full h-full" 
          baseColor="#172438" 
          highlightColor="#30507A"
        />
      </div>
    </div>
  );
};

export default LoginSkeleton;