import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';

import EmailChange from './Component/EmailChange';
import PasswordChange from './Component/PasswordChange';
import ComplaintForm from './Component/ComplaintForm';
import SocialMediaLinkChange from './Component/SocialMediaLinkChange';
import { useState } from 'react';

const Setting = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  return (
    <div className="grid grid-cols-9 h-screen max-w-[100vw] text-white font-sans ">
      {/* Sidebar with Dashboard Links */}
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden sm:col-span-2' : 'col-span-3 sm:col-span-1'
        }`}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
          setHoverDashboard={setHoverDashboard}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard
            ? 'col-span-9 sm:col-span-9'
            : 'col-span-6 sm:col-span-8'
        } overflow-scroll`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300">
            <BiSolidRightArrow size={40} color="orange" onClick={handleClick} />
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
