import { useEffect, useState } from 'react';
import programmeData from '../data/programmeData';
import ProgrammeCardMobile from './ProgrammeCardMobile';
import EquipCard from './EquipCard';


const ProgrammeCard = () => {
  const [data, setData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setData(programmeData);
  }, []);

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
    <div className="text-white">
      <div className="bg-footerColor flex flex-col items-center text-white min-h-screen max-w-[90%] mx-auto rounded-xl p-10">
        <div className="flex justify-between items-center w-full p-1 sm:p-10">
          <div className="text-[1xl] sm:text-[3rem] flex  items-center font-sans font-extrabold">
            Our Core Services
          </div>
          <div className="h-[2.5rem] w-[3.5rem]   sm:h-[3rem]  sm:w-[4em] rounded-xl  flex justify-center items-center border">
            8 total
          </div>
        </div>

        {!isSmallScreen ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 bg-trainerColor  ">
            {data.map((data) => (
              <div
                key={data.id}
                className="rounded-xl  m-auto h-[40vh] w-[70vw] sm:h-[40vh] sm:w-[30vw] overflow-hidden bg-primary relative"
              >
                <img
                  src={data.image}
                  alt="trainer"
                  className="object-cover h-full  float-right w-full rounded-lg opacity-30"
                />
                <div>
                  <div className="mt-[1rem] font-extrabold items-center text-4xl font-sans text-white h-[20vh] absolute top-[50%] left-[5%]">
                    {data.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <ProgrammeCardMobile />
          </>
        )}
      </div>

      <div>
        <EquipCard />
      </div>
    </div>
  );
};

export default ProgrammeCard;
