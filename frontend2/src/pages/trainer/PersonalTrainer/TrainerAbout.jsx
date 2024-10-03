import React from 'react';
import { FaCheckCircle, FaCheckSquare } from 'react-icons/fa'; // Import the icons
import Header from '../../../component/Header';
import { useParams } from 'react-router-dom';
import useTrainerDetailHook from '../../../../hook/useTrainerDetailHook';
import { useSelector } from 'react-redux';
import { BsArrowRight } from 'react-icons/bs';

const TrainerAbout = () => {
  const { trainerId } = useParams();

  const { trainer, description, loading, error, userTrainerDetails } =
    useTrainerDetailHook(trainerId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading trainer details.</p>;

  return (
    <>
      {/* Header */}
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <div className="relative h-[30vh] w-full flex items-center justify-center text-white bg-cover bg-center">
          {/* Semi-transparent overlay for better text readability */}
          <div className="absolute inset-0 bg-opacity-60"></div>

          {/* Container for text content */}
          <div className="relative z-10 p-8 sm:p-16 text-center">
            <h1 className="text-transparent  text-4xl sm:text-6xl md:text-7xl text-white  font-bebes">
              {userTrainerDetails ? userTrainerDetails?.name : 'Loading...'}
            </h1>

            {/* Tagline */}
            <h2 className="text-orange-400 text-xl sm:text-2xl md:text-3xl mt-4">
              {description ? description.tagline : 'Loading...'}
            </h2>

            {/* Pricing Information */}
            <div className="text-white text-lg sm:text-xl mt-6 flex flex-col justify-center items-center space-x-4">
              <p className="flex items-center text-white text-lg">
                ProgrammePanda Guaranteed
                <FaCheckCircle className="text-green-400 text-2xl" />
              </p>
            </div>
          </div>
        </div>

        {/* ProgrammePanda Guaranteed Section at the Bottom */}
      </div>

      {/* Section for additional information */}
    </>
  );
};

export default TrainerAbout;
