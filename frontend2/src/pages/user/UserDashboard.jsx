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

  return (
    <div
      className="grid grid-cols-9 max-w-[100vw] text-white font-sans"
      style={{
        background:
          'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',

        height: '100vh',
        width: '100vw',
      }}
    >
      <div className="col-span-9 sticky top-0 z-50">
        <DashboardHeader />
      </div>
      {/*bg-[#172438]*/}
      <div
        className="p-2 overflow-hidden min-h-[88vh]   sm:py-[10%] w-[100vw]  "
        style={{
          background: 'linear-gradient(to bottom, #1f2937, #111827, #0a0f14)',
        }}
      >
        {/* Welcome Text Instead of Image */}
        <div className="h-full w-full flex flex-col mt-[35%] sm:mt-0 justify-start sm:justify-center items-center text-center mb-1 ">
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
  );
};

export default UserDashboard;
