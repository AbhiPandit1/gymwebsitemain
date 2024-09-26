import { useEffect, useState } from 'react';
import { PiSignInThin } from 'react-icons/pi';
import { LiaSignOutAltSolid } from 'react-icons/lia';
import { MdSportsGymnastics } from 'react-icons/md';
import { IoHomeOutline } from 'react-icons/io5';
import { GiClassicalKnowledge } from 'react-icons/gi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../reducers/userReducer';
import { toast } from 'react-toastify';
import { BiCategoryAlt } from 'react-icons/bi';

const Menu = () => {
  const { user } = useSelector((state) => state.user);
  const isSignIn = user && user.user && user.token; // Check if user is signed in
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user.user.role);

  // Initial menu items
  let menuData = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      image: <IoHomeOutline color="orange" size={30} />,
    },
    {
      id: '3',
      name: 'Explore',
      link: '/programmes',
      image: <MdSportsGymnastics color="orange" size={30} />,
    },
    {
      id: '4',
      name: 'Creators',
      link: '/trainers',
      image: <GiClassicalKnowledge color="orange" size={30} />,
    },
  ];

  // Add additional menu items based on user role
  if (user && user.user.role === 'trainer') {
    menuData.push({
      id: '5',
      name: 'Billing',
      link: `/account/link/${user.user._id}`,
      image: <BiCategoryAlt color="orange" size={30} />,
    });
  }

  if (isSignIn) {
    menuData.push({
      id: '6',
      name: 'Dashboard',
      link: `/user/dashboard/${user.user._id}`,
      image: <GiClassicalKnowledge color="orange" size={30} />,
    });
  }

  const [menuDatas, setMenuDatas] = useState(menuData);

  // Sign out handler
  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/login');
    toast.success('Signed out successfully');
  };

  // Update the menu when the user changes
  useEffect(() => {
    setMenuDatas(menuData);
  }, [user]);

  return (
    <div
      className=" text-white min-h-[30vh] min-w-[20vw] absolute p-8 top-[140%] right-0 rounded-xl border border-gray-700 shadow-lg z-50"
      style={{
        background:
          'linear-gradient(270deg, #172438 100%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
      }}
    >
      <div className="flex flex-col mb-5 z-50">
        <div className="flex justify-between items-center border-b border-gray-600 pb-4 mb-4">
          <div className="font-sans font-semibold text-lg">
            {isSignIn ? (
              <Link
                to="/signin"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LiaSignOutAltSolid color="orange" size={24} />
                Sign Out
              </Link>
            ) : (
              <Link to="/signin" className="flex items-center gap-2">
                <PiSignInThin color="orange" size={24} />
                Sign In
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {menuDatas.map((data) => (
            <Link
              to={data.link}
              key={data.id}
              className="relative group flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="text-white text-lg group-hover:text-orange-400 transition-colors duration-300 ease-in-out">
                  {data.name}
                </div>
                <div className="ml-auto text-orange-400 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                  {data.image}
                </div>
              </div>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out rounded-lg"></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
