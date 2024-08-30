import Logo from './Logo';
import SignIn from '../assets/dashboard.png';
import { Link } from 'react-router-dom';
import { ImCross } from 'react-icons/im';
import { RxHamburgerMenu } from 'react-icons/rx';

const DashboardComponent = ({ dashBoardLink, hoverDashboard }) => {
  return (
    <div
      className=" text-white min-w-full  shadow-lg shadow-orange-500  max-h-[100vh] min-h-[100vh] rounded-r-[10px] flex flex-col relative "
      style={{
        backgroundColor: '#090813',
      }}
    >
      <div>
        <div className="h-[10vh] mt-[15%]">{/*Logo */}</div>
        <div className="h-full w-full  mt-20">
          {dashBoardLink.map((dashboard) => (
            <div
              key={dashboard.id}
              className="mt-[1rem] overflow-hidden w-full flex justify-center items-center hover:bg-orange-900 hover:rounded-full transition duration-300 ease-in-out py-2"
            >
              <Link to={dashboard.link}>
                <p className="text-3xl font-sans font-bold">{dashboard.icon}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-[45%] top-8 cursor-pointer">
        {!hoverDashboard ? (
          <ImCross size={20} color="orange" />
        ) : (
          <RxHamburgerMenu size={20} />
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
