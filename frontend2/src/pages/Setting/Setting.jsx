import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';

import ComplaintForm from './Component/ComplaintForm';
import EmailChange from './Component/EmailChange';
import PasswordChange from './Component/PasswordChange';
import ReviewForm from './Component/ReviewForm';
import SocialMediaLinkChange from './Component/SocialMediaLinkChange';

const Setting = () => {
  const dashBoardLink = useDashboardLinks();
  return (
    <div className="grid grid-cols-7 h-screen">
      {/* Sidebar */}
      <div className="hidden sm:col-span-2 sm:grid bg-black text-white overflow-y-auto">
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>

      {/* Main Content */}
      <div className="col-span-7 sm:col-span-5 bg-primary text-white">
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
  );
};

export default Setting;
