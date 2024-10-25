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
    <div className="relative w-full">
      <Header />
      <h1 className="text-[2rem] font-bebes flex justify-center items-center sm:text-[40px] text-white">
        {title}
      </h1>

    </div>
  );
};

export default HeroSection;
