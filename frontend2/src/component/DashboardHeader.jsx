import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { RxAvatar } from 'react-icons/rx';
import Menu from './Menu';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const [showMenu, setShowMenu] = useState(false);

  const { user, loading } = useSelector((state) => state.user.user);

  const handleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  return (
    <div className="col-span-5 min-w-[100vw] sm:min-w-full max-w-[100vw]">
      <div className="flex justify-between items-center sm:m-2 sm:p-4 p-4">
        <Link to={`/user/dashboard/${user._id}`}>
          <div className="text-xl sm:text-3xl font-sans font-bold">
            Dashboard
          </div>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="relative">
            <IoMdNotifications
              size={40}
              color="white"
              aria-label="Notifications"
            />
            {user && !user.hasTakenProgram && (
              <Link to={`/user/detail/${user._id}`}>
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
                  <p className="text-xl sm:text-3xl font-sans text-white font-bold">
                    {user.name}
                  </p>
                  <div className="h-[2rem] w-[2rem] sm:h-[3rem] sm:w-[3rem] bg-tertiary rounded-xl flex justify-center items-center">
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
