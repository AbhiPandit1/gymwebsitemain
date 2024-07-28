import Logo from './Logo';
import SignIn from '../assets/dashboard.png';
import { Link } from 'react-router-dom';
import { ImCross } from 'react-icons/im';
import { RxHamburgerMenu } from 'react-icons/rx';

const DashboardComponent = ({ dashBoardLink, hoverDashboard }) => {
  return (
    <div className="bg-tertiary min-h-[100vh] rounded-r-[64px] flex flex-col relative">
      <div>
        <div className="h-[10vh] mt-[15%]">
          <Logo
            backgroundImage={SignIn}
            className="w-[4rem]"
            alt="Sign In Logo"
          />
        </div>
        <div className="h-full w-full mt-20">
          {dashBoardLink.map((dashboard) => (
            <div
              key={dashboard.id}
              className="mt-[1rem] overflow-hidden w-full flex justify-center items-center hover:bg-secondary hover:rounded-2xl transition duration-300 ease-in-out py-2"
            >
              <Link to={dashboard.link}>
                <p className="text-3xl font-sans font-extrabold">
                  {dashboard.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-10 top-8 cursor-pointer">
        {!hoverDashboard ? (
          <ImCross size={30} />
        ) : (
          <RxHamburgerMenu size={30} />
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
