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
  const dashboardLink = useDashboardLinks(); // Fixed variable name

  return (
    <div
      className="grid grid-cols-9 h-screen max-w-[100vw]  text-white font-sans "
      style={{
        backgroundColor: '#343639',
      }}
    >
      <div
        className={`transition-transform duration-300 bg-gray-900   ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-3 sm:col-span-1'
        }`}
      >
        <DashboardComponent
          dashBoardLink={dashboardLink} // Fixed variable name
          hoverDashboard={hoverDashboard}
          setHoverDashboard={setHoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard
            ? 'col-span-9 sm:col-span-9'
            : 'col-span-6 sm:col-span-8'
        } overflow-hidden`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div
            className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={40} color="orange" />
          </div>
        )}
        <div className="p-2">
          <div className="bg-gray-800 h-full w-full flex flex-col mb-1">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dzy51cqxa/image/upload/v1724174237/profile_photos/oxnhsb37p3ilw26zropi.jpg"
                alt="homeGirl"
                className="h-[100vh] w-full object-right sm:object-cover rounded-[10px] "
              />
              <div className="absolute flex flex-col justify-center top-1/3 w-full">
                <div className="text-gray-100 flex flex-col justify-center items-center">
                  <div className="text-2xl font-extrabold tracking-tighter sm:text-2xl md:text-4xl">
                    ACHIEVE MORE
                  </div>
                  <div className="text-2xl font-bold tracking-tighter md:text-4xl sm:text-2xl mt-2">
                    THAN JUST FITNESS
                  </div>
                </div>
                <div className="text-gray-100 flex items-start justify-center w-full mt-8">
                  <Link
                    to={
                      role === 'user'
                        ? '/user/programmes'
                        : `/trainer/programmes/${user.user._id}`
                    }
                    className="text-gray-300 hover:text-gray-100 focus:outline-none"
                  >
                    <button className="w-[17rem] sm:w-[18rem] h-[4rem] bg-orange-500 flex justify-between items-center ml-4 mr-2 pr-4 rounded-xl">
                      <span className="ml-4 text-xl">
                        {role === 'trainer'
                          ? 'Make your own programs'
                          : 'Your Programs'}
                      </span>
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
