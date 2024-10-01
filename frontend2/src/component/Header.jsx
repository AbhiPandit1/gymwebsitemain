import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logoHeader from '../assets/NewLogo.png';
import { IoHomeOutline } from 'react-icons/io5';
import { MdSportsGymnastics } from 'react-icons/md';
import { GiClassicalKnowledge, GiHamburgerMenu } from 'react-icons/gi';
import { ImCross } from 'react-icons/im';
import Logo from './Logo';
import { Link, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import { signOut } from '../reducers/userReducer';
import { toast } from 'react-toastify';

const Header = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { user } = useSelector((state) => state.user);
  const isSignedIn = user && user.token; // Check if user has a token
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuData = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      image: <IoHomeOutline color="white" size={30} />,
    },
    {
      id: '2',
      name: 'Explore',
      link: '/programmes',
      image: <MdSportsGymnastics color="white" size={30} />,
    },
    {
      id: '3',
      name: 'Creators',
      link: '/trainers',
      image: <GiClassicalKnowledge color="white" size={30} />,
    },
  ];

  const menuItems = [...menuData];
  if (isSignedIn) {
    menuItems.push({
      id: '5',
      name: 'Dashboard',
      link: `/user/dashboard/${user.user._id}`,
      image: <GiClassicalKnowledge color="white" size={30} />,
    });
  }

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/login');
    toast.success('Signed out successfully');
  };

  return (
    <div className="flex justify-between items-center p-4 w-full  rounded-l-[1.2rem] rounded-r-[1.2rem] shadow-lg bg-transparent font-bebes">
      {/* Logo */}
      <div className="ml-[5%]">
        <Link to="/">
          <Logo backgroundImage={logoHeader} />
        </Link>
      </div>

      {/* Navigation Menu for larger screens */}
      <div className="hidden sm:flex justify-center items-center gap-3 w-full z-40  ">
        <div className="flex justify-around items-center font-extrabold opacity-95 ml-[15%] mr-[15%] w-[90%] h-[3rem] z-40 mx-auto rounded-lg ">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="flex flex-col items-center text-[1rem] text-white no-underline transition-colors duration-300  hover:text-orange-400"
            >
              <span className="text-lg font-extrabold">{item.name}</span>
            </Link>
          ))}
        </div>
        {!isSignedIn ? (
          <>
            <Link to="/signin">
              <button className="h-[3rem] w-[6rem] rounded-lg  text-white bg-transparent border-2 border-orange-600  hover:bg-orange-800 z-40">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="h-[3rem] w-[6rem] rounded-lg  border-2 bg-gradient-to-r from-orange-400 to-orange-600  text-white bg-tansparent hover:bg-orange-800 z-40">
                Log In
              </button>
            </Link>
          </>
        ) : (
          <button
            className="h-[3rem] w-[10rem] rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-600  hover:bg-orange-800 z-40"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        )}
      </div>

      {/* Menu Toggle Button for small screens */}
      <div className="flex sm:hidden items-center">
        <div className="relative cursor-pointer" onClick={toggleMenu}>
          {!isMenuVisible ? (
            <GiHamburgerMenu color="white" size={24} />
          ) : (
            <ImCross color="white" size={24} />
          )}
          {isMenuVisible && <Menu />}
        </div>
      </div>
    </div>
  );
};

export default Header;
