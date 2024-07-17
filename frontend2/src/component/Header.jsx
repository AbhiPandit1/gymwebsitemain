import  { useState } from 'react';
import { CiHome, CiMail, CiLocationOn } from 'react-icons/ci';
import logoHeader from '../assets/logoHeader.png';
import { RxDashboard } from 'react-icons/rx';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import Menu from './Menu';

const Header = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div className="flex justify-between items-center bg-secondary w-[90%] h-20 m-[4%] absolute rounded-l-[1.2rem] rounded-r-[1.2rem] z-20">
      <div className="hidden sm:flex justify-center items-center p-2 gap-1">
        <div className="block w-[48px] h-[48px] bg-black bg-opacity-25 p-3 rounded-[1rem]">
          <CiHome
            className="w-[24px] h-[24px] m-auto rounded-[1rem]"
            color="white"
          />
        </div>
        <div className="block w-[48px] h-[48px] bg-black bg-opacity-25 p-3 rounded-[1rem]">
          <CiMail
            className="w-[24px] h-[24px] m-auto rounded-[1rem]"
            color="white"
          />
        </div>
        <div className="block w-[48px] h-[48px] bg-black bg-opacity-25 p-3 rounded-[1rem]">
          <CiLocationOn
            className="w-[24px] h-[24px] m-auto rounded-[1rem]"
            color="white"
          />
        </div>
      </div>
      <div className="m-auto">
        <Link to="/">
          <Logo backgroundImage={logoHeader} />
        </Link>
      </div>
      <div className="flex items-center mr-4 sm:mr-6">
        <div className="mr-2">
          <div className="hidden sm:flex font-sans text-white font-semibold">
            Main Menu
          </div>
        </div>

        <div
          className="ml-0 mt-3.5 w-[40px] h-[40px] relative cursor-pointer"
          onClick={toggleMenu}
        >
          <RxDashboard
            color="white"
            className="h-[24px] w-[24px] float-right mr-0"
          />
          {isMenuVisible && <Menu />}
        </div>
      </div>
    </div>
  );
};

export default Header;
