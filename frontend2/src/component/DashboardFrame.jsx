import { useState } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../hook/CreateDahsboardLinks';
import DashboardComponent from './DashboardComponent';
import DashboardHeader from './DashboardHeader';

const DashboardFrame = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };
  return (
    <div className="grid grid-cols-7 h-screen max-w-[100vw] text-white font-sans">
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden' : 'col-span-7'
        } sm:${hoverDashboard ? 'hidden' : 'col-span-2'}`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'col-span-7' : 'col-span-7'
        } sm:${hoverDashboard ? 'col-span-7' : 'col-span-5'}`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div
            className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={80} color="white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFrame;
