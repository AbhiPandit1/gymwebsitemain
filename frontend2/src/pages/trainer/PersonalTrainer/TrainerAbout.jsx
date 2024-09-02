import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaInfoCircle, FaCheckSquare } from 'react-icons/fa'; // Import the icons
import ProgrammeInfo from './ProgrammeInfo';
import Header from '../../../component/Header';

const TrainerAbout = () => {
  return (
    <>
      {/* Header */}
      <div
        className="relative z-10"
        style={{
          backgroundImage: `url('https://s3-alpha-sig.figma.com/img/de97/3247/22d2cdd901cc39df68864905ac8641de?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MHufE7SHL7~4f6Ny-hCtPnkMS0rlci2Tsddug49RDxSU7pRXm7I17M~5dkKyXDICIZMCCuSfTRetuDkHCv5LMaRYs4i4vz3szCW-n6ZlWZOhwJ4BEQg4vkaBVLSOABFHR6q0vjDlMxvesSGfGAm1fUHICwZF1Z~l1WXe6vOL4p2~2FcZHQWtByzZnwvDKNV6eedsPK6Tbc~KIY4z3DOv56ib1RX9--9EAXmvsFZyT0jBactfdkYL7368sEKDGL-a5-gR~ksCVRRHfpkxDiGvIfLOORMNlCSltL9YkXzfrW8-Sc2~rokmmY37VbuY3H6wpWsLwNyRZ9e-iR0F5N~mxw__')`,
          backgroundSize: 'cover', // Ensures the image covers the entire container
          backgroundPosition: 'center', // Centers the image within the container
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Header />

        {/* Hero Section */}
        <div className="relative h-[50vh] sm:h-screen w-full flex items-center justify-start text-white bg-cover bg-center">
          {/* Semi-transparent overlay for better text readability */}
          <div className="absolute inset-0 bg-opacity-60"></div>

          {/* Container for text content */}
          <div className="relative z-10 p-8 sm:p-16 text-center">
            {/* Name */}
            <h1
              className="text-transparent font-extrabold text-4xl sm:text-6xl md:text-7xl"
              style={{
                WebkitTextStroke: '3px orange',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Abhishek
            </h1>

            {/* Tagline */}
            <h2 className="text-orange-400 text-xl sm:text-2xl md:text-3xl mt-4">
              Change Your World Here
            </h2>

            {/* Pricing Information */}
            <div className="text-white text-lg sm:text-xl mt-6 flex justify-center items-center space-x-4">
              <button className="bg-orange-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-orange-600 transition duration-300">
                Buy Now
              </button>
              <div className="flex items-center space-x-2">
                <p className="line-through text-red-400 text-lg">$22</p>
                <p className="text-green-400 text-lg">$20</p>
              </div>
            </div>
          </div>
        </div>

        {/* ProgrammePanda Guaranteed Section at the Bottom */}
        <div className="absolute bottom-4 left-8 flex items-center text-white text-lg space-x-2">
          <p>ProgrammePanda Guaranteed</p>
          <FaCheckSquare className="text-green-400 text-2xl" />
        </div>
      </div>

      {/* Section for additional information */}
    </>
  );
};

export default TrainerAbout;
