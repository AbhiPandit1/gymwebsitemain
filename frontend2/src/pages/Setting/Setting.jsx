import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';

import ComplaintForm from './Component/ComplaintForm';
import EmailChange from './Component/EmailChange';
import PasswordChange from './Component/PasswordChange';
import ReviewForm from './Component/ReviewForm';
import SocialMediaLinkChange from './Component/SocialMediaLinkChange';
import { useState } from 'react';

const Setting = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  return (
    <div className="grid grid-cols-9 h-screen max-w-[100vw] text-white font-sans bg-gray-900">
      {/* Sidebar with Dashboard Links */}
      <div
        className={`transition-transform duration-300 bg-gray-900 ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-2 sm:col-span-1'
        }`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard
            ? 'col-span-9 sm:col-span-9'
            : 'col-span-7 sm:col-span-8'
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

        {/* Settings Content */}
        <div className="p-4">
          <h1 className="text-3xl font-extrabold text-center mb-4">Settings</h1>
          <EmailChange />
          <PasswordChange />
          <SocialMediaLinkChange />
          <ComplaintForm />
        </div>
      </div>
    </div>
  );
};

export default Setting;
