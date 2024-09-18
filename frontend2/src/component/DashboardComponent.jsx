import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImCross } from 'react-icons/im';
import { RxHamburgerMenu } from 'react-icons/rx';

const DashboardComponent = ({
  dashBoardLink,
  hoverDashboard=false,
  setHoverDashboard,
}) => {
  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  return (
    <div
      className="text-white min-w-full shadow-lg shadow-orange-500 max-h-screen min-h-[100vh] rounded-r-[10px] flex flex-col relative"
      style={{
        background:
          'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
      }}
    >
      {/* Dashboard Links */}
      <div className="h-full w-full py-[40%] px-8  ">
        {dashBoardLink?.map((dashboard) => (
          <div
            key={dashboard.id}
            className="mt-[1rem] overflow-hidden w-full flex items-start justify-center hover:bg-orange-900 hover:rounded-full transition duration-300 ease-in-out py-2 px-4"
          >
            <Link to={dashboard.link} className="flex items-start w-full">
              <p className="text-xl font-sans font-bold mr-4">{dashboard.icon}</p>
              <span className="text-lg font-sans font-bold">{dashboard.name}</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Hamburger or Cross Icon for Toggling Sidebar */}
      <div className="absolute px-12 top-8 cursor-pointer">
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
