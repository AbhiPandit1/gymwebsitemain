import TrainerCard from './TrainerCard';
import TrainerCardMobile from './TrainerCardMobile';
import { useEffect, useState } from 'react';
import { GoPlus } from 'react-icons/go';

const Trainers = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
    <div className="bg-footerColor flex flex-col items-center text-white min-h-screen w-[90%] min-w-[80%] mx-auto rounded-xl p-10">
      <div className="flex flex-col ">
        <div className=" flex flex-col justify-center  w-[100%] sm:w-[60%] sm:ml-[20%]   ">
          <div className="   ">Search</div>
          <div className="flex justify-center items-start   ">
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-[40rem] h-12 px-4 rounded-l-[1rem] rounded-r-[1rem] bg-tertiary border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>
        {isSmallScreen ? (
          <div className="mt-4">
            <TrainerCardMobile />
          </div>
        ) : (
          <div className="mt-4">
            <TrainerCard />
          </div>
        )}
      </div>
      <button className="bg-white text-black mt-[6%] p-4 rounded-xl flex ">
        <div className="mr-3 flex justify-center mt-1">Load more </div>
        <div>
          <GoPlus size={30} className="flex justify-center " />
        </div>
      </button>
    </div>
  );
};

export default Trainers;
