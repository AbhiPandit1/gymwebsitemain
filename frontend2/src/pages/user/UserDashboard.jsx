import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import homeGirl from '../../assets/homeGirl.jpeg';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { useState } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';

const UserDashboard = () => {
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const { user } = useSelector((state) => state.user);
  const role = user.user.role;
  const dashBoardLink = useDashboardLinks();

  return (
    <div className="grid grid-cols-7 min-h-screen max-h-screen overflow-hidden text-white">
      <div
        className={`${hoverDashboard ? 'hidden' : 'col-span-7'} sm:${
          hoverDashboard ? 'hidden' : 'col-span-2'
        }`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
        />
      </div>
      <div
        className={`${hoverDashboard ? 'col-span-7' : 'col-span-5'} sm:${
          hoverDashboard ? 'col-span-7' : 'col-span-5'
        }`}
      >
        <DashboardHeader />
        <div className="p-2">
          <div className="bg-primary h-full w-full flex flex-col mb-1">
            <div className="relative">
              <img
                src={homeGirl}
                alt="homeGirl"
                className="h-screen w-full object-cover"
              />
              <div className="absolute flex flex-col justify-center top-1/3 w-full">
                <div className="text-white flex flex-col justify-center items-center">
                  <div className="text-3xl font-extrabold tracking-tighter sm:text-2xl md:text-4xl">
                    ACHIEVE MORE
                  </div>
                  <div className="text-4xl font-bold tracking-tighter md:text-4xl sm:text-2xl mt-2">
                    THAN JUST FITNESS
                  </div>
                  {hoverDashboard && (
                    <div
                      className="absolute left-0 top-0 animate-shake cursor-pointer"
                      onClick={handleClick}
                    >
                      <BiSolidRightArrow size={80} color="white" />
                    </div>
                  )}
                </div>
                <div className="text-white flex items-start justify-center w-full mt-8">
                  <Link
                    to={
                      role === 'user'
                        ? '/user/programmes'
                        : `/trainer/programmes/${user.user._id}`
                    }
                    className="text-white-500 hover:text-gray-300 focus:outline-none"
                  >
                    <button className="w-[17rem] sm:w-[18rem] h-[4rem] bg-secondary flex justify-between items-center ml-4 mr-2 pr-4 rounded-xl">
                      <span className="ml-4 text-xl">
                        {role === 'trainer'
                          ? 'Make your own programs'
                          : 'Your Programs'}
                      </span>
                      <IoIosArrowRoundForward
                        color="white"
                        className="w-14 h-10"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
