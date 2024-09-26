import React, { useState, useEffect } from 'react';
import Trainers from './Trainers';
import EquipCard from './EquipCard';
import HeroSection from './HeroSection';
import Footer from './Footer';
import HeroSectionSkeleton from '../pages/skeletons/HeroSectionSkeleton';

const TrainerComponent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a data fetch
    const fetchData = async () => {
      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        {isLoading ? (
          <HeroSectionSkeleton />
        ) : (
          <HeroSection
            category="Search Creators"
            para="Empower your training with our best Creator"
            title="Creators"
          />
        )}
        <div className="h-auto top-[20%]">
          <Trainers />
        </div>

        {/* EquipCard */}

        <Footer />
      </div>
      {/* Trainers */}
    </>
  );
};

export default TrainerComponent;
