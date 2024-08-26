import { useState } from 'react';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import { BiSolidRightArrow } from 'react-icons/bi';
import TrainerProfile from '../trainer/TrainerProfile';
import ProgrammeDetailUser from './ProgrammeDetail/ProgrammeDetailUser';
import TotalRevenueCard from './TotalRevenueCard';
import Profile from './ProgrammeDetail/Profile';
import ProgrammeDetailTrainer from './ProgrammeDetail/ProgrammeDetailTrainer';

const DashboardPanel = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  return (
    <div className="grid grid-cols-7 h-screen max-w-[100vw] text-white font-sans bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar Section */}
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden' : 'col-span-7'
        } sm:${
          hoverDashboard ? 'hidden' : 'col-span-2'
        } bg-gradient-to-b shadow-lg`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
        />
      </div>

      {/* Main Content Section */}
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'col-span-7' : 'col-span-7'
        } sm:${
          hoverDashboard ? 'col-span-7' : 'col-span-5'
        } overflow-y-scroll bg-gradient-to-b from-gray-800 to-gray-900 p-6`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div
            className="absolute left-0 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300 z-50"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={80} color="white" />
          </div>
        )}
        <section className="grid sm:grid-cols-2 grid-cols-1 gap-8 p-8">
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
            <Profile />
          </div>

          {/* Total Revenue Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
            <TotalRevenueCard />
          </div>

          {/* Programme Detail User Card */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
            <ProgrammeDetailUser />
          </div>

          {/* Programme Detail Trainer Card */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
            <ProgrammeDetailTrainer />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPanel;
