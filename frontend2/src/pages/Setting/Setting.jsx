import { BiSolidRightArrow } from 'react-icons/bi';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import DashboardHeader from '../../component/DashboardHeader';
import EmailChange from './Component/EmailChange';
import PasswordChange from './Component/PasswordChange';
import ComplaintForm from './Component/ComplaintForm';
import SocialMediaLinkChange from './Component/SocialMediaLinkChange';
import { useState } from 'react';

const Setting = () => {
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const toggleHoverDashboard = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  return (
    <div className="grid grid-cols-9 max-w-[100vw] text-white font-sans bg-black">
      {/* Sticky Header */}
      <div className="col-span-9 sticky top-0 z-50">
        <DashboardHeader />
      </div>

      {/* Toggle Dashboard Visibility on Small Screens */}
      {hoverDashboard && (
        <div
          className="absolute left-0 z-10 top-1/4 transform -translate-y-1/2 animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
          onClick={toggleHoverDashboard}
        >
          <BiSolidRightArrow size={40} color="orange" />
        </div>
      )}

      {/* Settings Content */}
      <div className="col-span-9 p-4 min-h-[100vh]">
        <h1 className="text-3xl font-extrabold text-center mb-4">Settings</h1>
        <EmailChange />
        <PasswordChange />
        <SocialMediaLinkChange />
        <ComplaintForm />
      </div>
    </div>
  );
};

export default Setting;
