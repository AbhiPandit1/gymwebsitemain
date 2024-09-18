import React from 'react';
import { IoIosArrowRoundDown } from 'react-icons/io';
import Header from './Header';
import HeroSectionSkeleton from '../pages/skeletons/HeroSectionSkeleton';

const HeroSection = ({
  category,
  para,
  searchCategory,
  isLoading,
  title,
  AdditionalComponent,
}) => {
  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  return (
    <div className="relative w-full h-[40vh]">
      <Header />

      {/* Header */}

      {/* Content */}
      <div className="absolute top-[70%]  transform -translate-y-1/2 w-full p-[10%] flex flex-col gap-5 z-20 font-bebes">
        {/* Heading */}
        <h1 className="text-[2rem] flex justify-center items-center sm:text-[3rem] font-bold bg-clip-text text-transparent bg-gradient-to-r  from-orange-500 to-yellow-500">
          {title}
        </h1>
        {/* Paragraph */}
        <div className="font-sans text-[1rem] sm:text-[1.6rem] text-gray-100 w-full leading-relaxed flex flex-col items-center">
          <div className="text-center mb-4">{para}</div>
          <div className="flex justify-center items-center"></div>
        </div>
        {/* Button (if needed) */}
      </div>
      {AdditionalComponent}
    </div>
  );
};

export default HeroSection;
