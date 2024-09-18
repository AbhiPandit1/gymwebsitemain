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
    <div
      className="grid grid-cols-9 max-w-[100vw] text-white font-sans"
      style={{
        background:
          'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
      }}
    >
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden' : 'col-span-9 sm:col-span-2'
        } overflow-hidden`}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
          setHoverDashboard={setHoverDashboard}
        />
      </div>

      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'col-span-9' : 'col-span-9 sm:col-span-7'
        } overflow-scroll relative min-h-[100vh]`}
      >
        <DashboardHeader />

        {/* Toggle Dashboard Visibility on Small Screens */}
        {hoverDashboard && (
          <div
            className="absolute left-0 z-10 top-1/4 transform -translate-y-1/2 animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={() => setHoverDashboard(false)}
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
