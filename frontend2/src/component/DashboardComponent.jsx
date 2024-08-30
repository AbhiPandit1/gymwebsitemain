import { useState } from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { ImCross } from 'react-icons/im';
import { RxHamburgerMenu } from 'react-icons/rx';

const DashboardComponent = ({
  dashBoardLink,
  hoverDashboard,
  setHoverDashboard,
}) => {
  const [showNames, setShowNames] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  const handleToggleNames = () => {
    setShowNames(!showNames);
  };

  return (
    <div
      className="text-white min-w-full shadow-lg shadow-orange-500 max-h-screen min-h-[100vh] rounded-r-[10px] flex flex-col relative"
      style={{ backgroundColor: '#090813' }}
    >
      {/* Dashboard Links */}
      <div className={`h-full w-full py-[80%] ${!showNames ? 'px-8' : 'px-2'}`}>
        {dashBoardLink.map((dashboard) => (
          <div
            key={dashboard.id}
            className="mt-[1rem] overflow-hidden w-full flex items-center justify-center hover:bg-orange-900 hover:rounded-full transition duration-300 ease-in-out py-2 px-4"
          >
            <Link to={dashboard.link} className="flex items-center w-full">
              {showNames ? (
                <span className="text-lg font-sans font-bold">
                  {dashboard.name}
                </span>
              ) : (
                <p
                  className={`text-xl font-sans font-bold transition-transform duration-300 ${
                    showNames ? 'text-xl' : ''
                  }`}
                >
                  {dashboard.icon}
                </p>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Toggle Button for Icon Names */}
      <div className="absolute sm:bottom-4 bottom-[30%] right-4">
        <button
          className="bg-gray-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ease-in-out text-sm sm:text-lg"
          onClick={handleToggleNames}
        >
          {showNames ? 'Hide Names' : 'Show Names'}
        </button>
      </div>

      {/* Hamburger or Cross Icon for Toggling Sidebar */}
      <div
        className={`absolute ${
          !showNames ? 'px-12' : 'px-12'
        } top-8 cursor-pointer`}
      >
        {hoverDashboard ? (
          <RxHamburgerMenu size={30} onClick={handleClick} />
        ) : (
          <ImCross size={30} color="orange" onClick={handleClick} />
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
