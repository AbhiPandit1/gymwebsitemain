import { useEffect, useState } from 'react';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import ProgrammeComponentCard from '../../component/ProgrammeComponentCard';
import ProgrammeComponentCardMobile from '../../component/ProgrammeComponentCardMobile';
import { useSelector } from 'react-redux';

const ShowProgramme = () => {
  {
    /**"/trainer/programmes/:id" */
  }

  const { user } = useSelector((state) => state.user);
  const dashBoardLink = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      role: 'user',
    },
    {
      id: '2',
      name: 'My Programs',
      link: '/user/programmes',
      role: '',
    },
    {
      id: '3',
      name: 'Settings',
      link: '/settings',
    },
    {
      id: '4',
      name: 'Edit',
      link: `/user/detail/${user.user._id}`,
    },
  ];
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
    <div className="grid grid-cols-7 text-white font-sans ">
      <div className="grid col-span-2 ">
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>
      <div className="grid col-span-5">
        <div>
          <DashboardHeader />
        </div>
        <div>
          <div className="bg-footerColor flex flex-col items-center text-white min-h-screen w-[100%] max-w-screen-lg mx-auto rounded-[32px] p-5  overflow-scroll max-h-[80vh] scrollbar-hide ">
            <div className=" flex flex-col justify-start  w-[80%] sm:[70%] ">
              <div className=" sm:pl-[10%] p-2 ">Search</div>
              <div className="flex justify-center items-start  ">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full sm:w-[40rem] h-12 px-4 rounded-l-[1rem] rounded-r-[1rem] bg-tertiary border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

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

export default ShowProgramme;
