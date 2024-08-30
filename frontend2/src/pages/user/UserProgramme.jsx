import { useEffect, useState } from 'react';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import ProgrammeComponentCardMobile from '../../component/ProgrammeComponentCardMobile';
import ProgrammeComponentCard from '../../component/ProgrammeComponentCard';
import { useSelector } from 'react-redux';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';

const UserProgramme = () => {
  {
    /*"/user/programme/:id" */
  }
  const { user } = useSelector((state) => state.user.user);

  const dashBoardLink = useDashboardLinks();
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
    <div className="grid sm:grid-cols-7 grid-cols-1 text-white font-sans " >
      <div className="hidden sm:grid  sm:col-span-2 ">
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>
      <div className="grid col-span-5">
        <div>
          <DashboardHeader />
        </div>
        <div>
          <div className="bg-footerColor flex flex-col items-center text-white min-h-screen w-[100%] max-w-screen-lg mx-auto rounded-[32px] p-5  overflow-scroll max-h-[80vh] scrollbar-hide ">
            <h1 className="font-sans text-3xl flex justify-center items-center text-white font-extrabold">
              Your Programme
            </h1>

            {isSmallScreen ? (
              <div className="mt-4">
                <ProgrammeComponentCardMobile />
              </div>
            ) : (
              <div className="mt-4">
                <ProgrammeComponentCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgramme;
