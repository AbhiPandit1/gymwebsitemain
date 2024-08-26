import { useState } from 'react';
import { useSelector } from 'react-redux';
import logoHeader from '../assets/header.png';
import { RxDashboard } from 'react-icons/rx';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import Menu from './Menu';

import { MdSportsGymnastics } from 'react-icons/md';
import { BiCategoryAlt } from 'react-icons/bi';
import { IoHomeOutline } from 'react-icons/io5';
import { GiClassicalKnowledge } from 'react-icons/gi';

const Header = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const menuData = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      image: <IoHomeOutline color="white" size={30} />,
    },
    {
      id: '2',
      name: 'Categories',
      link: '/categories',
      image: <BiCategoryAlt color="white" size={30} />,
    },
    {
      id: '3',
      name: 'Explore',
      link: '/programmes',
      image: <MdSportsGymnastics color="white" size={30} />,
    },
    {
      id: '4',
      name: 'Creators',
      link: '/trainers',
      image: <GiClassicalKnowledge color="white" size={30} />,
    },
  ];

  const { user } = useSelector((state) => state.user);
  const isSignedIn = user && user.token; // Check if user has a token

  // Conditionally add Dashboard menu item
  const menuItems = [...menuData];
  if (isSignedIn) {
    menuItems.push({
      id: '5',
      name: 'Dashboard',
      link: `/user/dashboard/${user.user._id}`,
      image: <GiClassicalKnowledge color="white" size={30} />,
    });
  } else {
    menuItems.push({
      id: '5',
      name: 'Sign In',
      link: '/signin', // Adjust the link to the actual sign-in page
      image: <GiClassicalKnowledge color="white" size={30} />,
    });
  }
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div
      className="flex justify-between items-center p-4 bg-transparent  w-full h-30 border-b border-orange-400 rounded-l-[1.2rem] rounded-r-[1.2rem] shadow-lg"
      style={{
        backgroundImage: `url('https://s3-alpha-sig.figma.com/img/fb55/b466/b05afb0a4774775c1b269cd0567431cd?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=k2kKnQWDVaXS2KNjmIuXcspoOwqvjRU0TVK232dlgoBtFMW0Ofrw4lcJKMzLCZNYmG3WL~O6lbOkgJzhPfhEWq3fhj4giSAjOsC4w4ycNxInm7NrJEznDq9-xsy1sN2BcBqvUSFEYaVkRIzdHEh1qJOGsInAuSXcpwBSXHGnESfEUrrdaR0uP4zQmqmGqwgZ7z9Uijpbudfyyivqo7e8jvKRhYhm2UGFQg-qXcJax2LJxETUPE6gAHjt3GhiNK39D~Lw1AEUS~bCIbWdOSVYAA6wNhBTlKh3JwoXPVGtlvjs9PS0QLXvLIBgL9ASEfiv3fJ9l3icHusqaZFCHNzAFg__')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* NewMenu for small screens */}
      {/* Navigation Menu for larger screens */}
      <div className="m-auto">
        <Link to="/">
          <Logo backgroundImage={logoHeader} />
        </Link>
      </div>
      <div className="hidden sm:flex justify-center items-center p-2 gap-1 w-full">
        <div className="flex justify-around items-center font-extrabold opacity-95 gap-2 w-[90%] h-[3rem] mx-auto rounded-lg shadow-lg">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="flex flex-col items-center text-[1.5rem] text-white no-underline transition-colors duration-300 hover:underline-offset-4 hover:underline hover:text-orange-300"
            >
              <span className="text-md font-extrabold">{item.name}</span>
            </Link>
          ))}
        </div>
        <button className="h-[3rem] w-[8rem] rounded-lg text-white bg-orange-400 hover:bg-orange-600">
          Contact
        </button>
      </div>
      {/* Menu Toggle Button */}(
      <div className="flex items-center  sm:hidden">
        <div
          className="relative w-[40px] h-[40px] cursor-pointer"
          onClick={toggleMenu}
        >
          <RxDashboard color="white" className="h-[24px] w-[24px]" />
          {isMenuVisible && <Menu />}
        </div>
      </div>
      )
    </div>
  );
};

export default Header;
