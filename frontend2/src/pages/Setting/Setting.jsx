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
    <div className="grid grid-cols-7 min-h-screen">
      {/* Sidebar */}
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden' : 'col-span-7 sm:col-span-2'
        } bg-black text-white overflow-y-auto`}
        onClick={handleClick}
      >
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>

      {/* Main Content */}
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'col-span-7' : 'col-span-7 sm:col-span-5'
        } bg-primary text-white`}
      >
        <div className="relative">
          {hoverDashboard && (
            <div
              className="absolute left-0 top-[20%] cursor-pointer animate-shake"
              onClick={handleClick}
            >
              <BiSolidRightArrow size={80} color="white" />
            </div>
          )}
          <div className="h-full">
            <div>
              <DashboardHeader />
            </div>

            <h1 className="text-3xl font-extrabold text-center">Settings</h1>
            <EmailChange />
            <PasswordChange />
            <SocialMediaLinkChange />
            <ComplaintForm />
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
