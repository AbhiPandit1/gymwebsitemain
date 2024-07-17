import Logo from './Logo';
import SignIn from '../assets/DashboardLogo.png';
import { Link } from 'react-router-dom';

const DashboardComponent = ({ dashBoardLink }) => {
  return (
    <div className="bg-tertiary min-h-[100vh] rounded-r-[64px] flex items-center justify-start  flex-col ">
      <div className=" h-[10vh] mt-10">
        <Logo
          backgroundImage={SignIn}
          className="w-[4rem]"
          alt="Sign In Logo"
        />
      </div>
      <div className=" h-full w-full  mt-20">
        {dashBoardLink.map((dashboard) => (
          <div
            key={dashboard.id}
            className=" mt-[1rem] overflow-hidden w-full flex justify-center items-center  hover:bg-secondary hover:rounded-2xl transition duration-300 ease-in-out   py-2"
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
  );
};

export default DashboardComponent;
