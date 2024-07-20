import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa';
import ProgrammeCardMobile from './ProgrammeCardMobile';
import EquipCard from './EquipCard';

const ProgrammeCard = () => {
  const [loadButton, setLoadButton] = useState(false);
  const { programme } = useSelector((state) => state.programme);

  const handleLoadMore = () => {
    setLoadButton(!loadButton);
  };

  // Check if `programme` and `programme.categories` are defined and are arrays
  if (!programme || !Array.isArray(programme.categories)) {
    console.error('Programme data is not available or is not an array');
    return null;
  }

  // Display up to 4 items when loadButton is false, otherwise display all items
  const visibleProgrammes = loadButton
    ? programme.categories
    : programme.categories.slice(0, 4);

  const isSmallScreen = window.innerWidth <= 640;

  return (
    <div className="text-white">
      <div className="bg-footerColor flex flex-col items-center text-white min-h-screen max-w-[90%] mx-auto rounded-xl p-10">
        <div className="flex justify-between items-center w-full p-1 sm:p-10">
          <div className="text-[1xl] sm:text-[3rem] flex items-center font-sans font-extrabold">
            Our Core Services
          </div>
          <div className="h-[2.5rem] w-[3.5rem] sm:h-[3rem] sm:w-[4em] rounded-xl flex justify-center items-center border">
            {programme.categories.length} total
          </div>
        </div>

        {!isSmallScreen ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 bg-trainerColor">
              {visibleProgrammes.map((data) => (
                <div
                  key={data._id}
                  className="rounded-xl m-auto h-[40vh] w-[70vw] sm:h-[40vh] sm:w-[30vw] overflow-hidden bg-primary relative"
                >
                  <img
                    src={data.categoryPhoto?.url || '/default-image.jpg'}
                    alt={`Trainer ${data._id}`}
                    className="object-cover h-full float-right w-full rounded-lg opacity-30"
                  />
                  <div className="mt-[1rem] font-extrabold items-center text-4xl font-sans text-white h-[20vh] absolute top-[50%] left-[5%]">
                    {data.category}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                className="w-40 h-12 text-lg bg-white text-black px-5 flex items-center justify-between rounded-lg shadow-md"
                onClick={handleLoadMore}
              >
                {loadButton ? (
                  <>
                    <FaMinus className="ml-2" />
                    Load Less
                  </>
                ) : (
                  <>
                    <FaPlus className="ml-2" />
                    Load More
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <ProgrammeCardMobile />
        )}
      </div>

      <div>
        <EquipCard />
      </div>
    </div>
  );
};

export default ProgrammeCard;
