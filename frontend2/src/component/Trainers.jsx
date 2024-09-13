import HomeSkeleton from '../pages/skeletons/HomeSkeleton';
import TrainerCard from './TrainerCard';
import TrainerCardMobile from './TrainerCardMobile';
import { useEffect, useState } from 'react';
import { GoPlus } from 'react-icons/go';

const Trainers = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check screen size on component mount and resize
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // Adjust breakpoint as needed
    };

    checkScreenSize(); // Check initially
    window.addEventListener('resize', checkScreenSize); // Add listener for resizing

    return () => {
      window.removeEventListener('resize', checkScreenSize); // Cleanup listener
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-white min-h-screen w-[100%] min-w-[100%] mx-auto rounded-xl p-10">
      <div className="flex flex-col ">
        <h1 className="text-3xl text-center ">Our Creators</h1>
        <div className="flex flex-col justify-center w-[100%] sm:w-[60%] sm:ml-[20%]">
          <div className="flex justify-center items-start mt-5">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[40rem] h-12 px-4 rounded-sm bg-tertiary border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>
        {isSmallScreen ? (
          <div className="mt-4">
            <TrainerCardMobile searchQuery={searchQuery} />
          </div>
        ) : (
          <div className="mt-4">
            <TrainerCard searchQuery={searchQuery} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Trainers;
