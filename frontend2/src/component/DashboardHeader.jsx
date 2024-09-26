import { useState, useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { RxAvatar, RxHamburgerMenu } from 'react-icons/rx';
import Menu from './Menu';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from './Logo';
import logoDahsboard from '../assets/NewLogo.png';
import useDashboardLinks from '../../hook/CreateDahsboardLinks';
import { RxCross2 } from 'react-icons/rx';

const DashboardHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [notification, setNotification] = useState(false);
  const [dashComponent, setDashComponent] = useState(false);

  const { user, loading } = useSelector((state) => state.user.user);

  const handleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);

  useEffect(() => {
    if (user && user.role === 'creator') {
      setNotification(true);
    }
  }, [user]);

  const handleProfileHover = () => {
    if ((user && !user.name) || user.role === 'creator') {
      toast.info('Complete your profile to enhance your experience!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000, // Toast duration in milliseconds
      });
    }
  };

  const toggleDashComponent = () => {
    setDashComponent((prevDashComponent) => !prevDashComponent);
  };

  return (
    <div className="min-w-[100vw] sm:min-w-full max-w-[100vw] shadow-lg shadow-orange-500 bg-gray-900">
      {dashComponent && (
        <div
          className={`absolute top-0 left-0 z-40 bg-gray-700 text-white transform ${
            dashComponent
              ? 'translate-x-0 opacity-100 w-6/12 sm:w-1/5' // Slide in and become visible
              : '-translate-x-full opacity-0 w-0' // Slide out and become invisible
          }`}
          style={{
            height: '100vh',
            transition:
              'transform 500ms ease-in-out, opacity 500ms ease-in-out, width 500ms ease-in-out',
          }}
        >
          <div className="h-full w-full bg-gray-800 ">
            <div className="flex justify-end items-end right-[5rem] mr-[5%]  py-[7%]  ">
              <RxCross2
                size={50}
                className="cursor-pointer transform  hover:scale-110 hover:rotate-90 transition duration-300 ease-in-out"
                onClick={toggleDashComponent}
              />
            </div>

            <div className="py-[40%] flex flex-col px-[3%] ">
              {dashBoardLink?.map((dashboard, index) => (
                <div
                  key={dashboard.id}
                  style={{
                    animation: `fadeSlideIn 0.5s ease-in-out ${
                      index * 0.1
                    }s both`,
                  }}
                  className="mt-[1rem] mr-[15%] overflow-hidden w-full hover:bg-orange-900 hover:rounded-full transition duration-300 ease-in-out py-2 px-4"
                >
                  <Link to={dashboard.link} className="flex items-start w-full">
                    <p className="text-2xl font-sans font-bold mr-4">
                      {dashboard.icon}
                    </p>
                    <span className="text-3xl font-sans font-bold">
                      {dashboard.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rest of the header code */}
      <div className="flex justify-between items-center sm:m-2 sm:p-4 p-4">
        <div className="flex justify-center gap-4">
          <RxHamburgerMenu
            size={50}
            onClick={toggleDashComponent}
            className="cursor-pointer transform hover:scale-110 transition duration-300 ease-in-out"
          />
          <Logo backgroundImage={logoDahsboard} />
        </div>
        <Link to={`/user/dashboard/${user?._id}`}>
          <div className="text-xl sm:text-2xl text-white mr-[4rem] font-sans sm:flex hidden font-bold">
            Dashboard
          </div>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="relative">
            <IoMdNotifications
              size={30}
              color="white"
              aria-label="Notifications"
            />
            {user && (!user.name || notification) && (
              <Link to={`/user/detail/${user?._id}`}>
                <div className="absolute h-[1rem] w-[1rem] rounded-full bg-red-400 top-0 right-1 flex justify-center items-center">
                  1
                </div>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <p className="text-xl sm:text-3xl font-sans text-white font-bold">
                Loading...
              </p>
            ) : (
              user && (
                <>
                  <p className="text-xl sm:text-2xl font-sans text-white font-bold">
                    {user.name}
                  </p>
                  <div
                    className="h-[2rem] w-[2rem] sm:h-[3rem] sm:w-[3rem] bg-tertiary rounded-xl flex justify-center items-center"
                    onMouseEnter={handleProfileHover}
                  >
                    {user.profilePhoto?.url ? (
                      <img
                        src={user.profilePhoto.url}
                        alt="profilePhoto"
                        className="rounded-[32px] opacity-1 h-[3rem] w-[3rem]"
                      />
                    ) : (
                      <RxAvatar size={40} />
                    )}
                  </div>
                </>
              )
            )}
            <div onClick={handleMenu} className="relative cursor-pointer">
              <FaAngleDown size={20} aria-label="Toggle Menu" />
              {showMenu && (
                <div className="absolute top-10 right-0 z-30">
                  <Menu />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
