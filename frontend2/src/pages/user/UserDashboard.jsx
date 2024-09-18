import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { useState } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const UserDashboard = () => {
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const { user } = useSelector((state) => state.user);
  const role = user.user.role;
  const dashboardLink = useDashboardLinks();

  return (
    <div
      className="grid grid-cols-9 max-w-[100vw] text-white font-sans"
      style={{
        background:
          'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
      }}
    >
      <div
        className={`transition-transform duration-300  ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-9 sm:col-span-2'
        }`}
      >
        <DashboardComponent
          dashBoardLink={dashboardLink}
          hoverDashboard={hoverDashboard}
          setHoverDashboard={setHoverDashboard}
        />
      </div>

      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'col-span-9' : 'col-span-9 sm:col-span-7'
        } overflow-hidden`}
      >
        <DashboardHeader />

        {/* Toggle Dashboard Visibility on Small Screens */}
        {hoverDashboard && (
          <div
            className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={40} color="orange" />
          </div>
        )}

        <div
          className="p-2 h-[88vh] overflow-hidden"
          style={{
            background:
              'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
          }}
        >
          {/* Welcome Text Instead of Image */}
          <div className="h-full w-full flex flex-col justify-center items-center text-center mb-1">
            <div className="text-gray-100 flex flex-col items-center">
              {/* User's Name */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-wide">
                Welcome, {user.user.name}!
              </h1>

              {/* Beautiful Line of Text */}
              <p className="mt-4 text-xl sm:text-2xl text-orange-400 font-medium tracking-widest">
                Start your journey towards fitness excellence today.
              </p>

              {/* Program Button */}
              <div className="flex items-start justify-center w-full mt-8">
                <Link
                  to={
                    role === 'user'
                      ? '/user/programmes'
                      : `/trainer/programmes/${user.user._id}`
                  }
                  className="text-gray-300 hover:text-gray-100 focus:outline-none"
                >
                  <button className="w-[17rem] sm:w-[15rem] h-[4rem] bg-orange-500 flex justify-between items-center px-4">
                    <span className="text-xl flex justify-center items-center gap-2">
                      Your Programs
                      <HiOutlineArrowNarrowRight size={30} />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
