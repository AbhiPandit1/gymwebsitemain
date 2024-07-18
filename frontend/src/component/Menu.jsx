import { useEffect, useState } from 'react';
import { PiSignInThin } from 'react-icons/pi';
import { LiaSignOutAltSolid } from 'react-icons/lia';
import { MdSportsGymnastics } from 'react-icons/md';
import { BiCategoryAlt } from 'react-icons/bi';
import { IoHomeOutline } from 'react-icons/io5';
import { GiClassicalKnowledge } from 'react-icons/gi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../reducers/userReducer';
import { toast } from 'react-toastify';

const Menu = () => {
  const { user } = useSelector((state) => state.user);

  const isSignIn = user && user.user && user.token; // Check if user is signed in

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
      name: 'Categories',
      link: '/categories',
      image: <BiCategoryAlt color="white" size={30} />,
    },
    {
      id: '3',
      name: 'Programmes',
      link: '/programmes',
      image: <MdSportsGymnastics color="white" size={30} />,
    },
    {
      id: '4',
      name: 'Trainers',
      link: '/trainers',
      image: <GiClassicalKnowledge color="white" size={30} />,
    },
  ];

  if (isSignIn) {
    menuData.push({
      id: '5',
      name: 'Dashboard',
      link: `/user/dashboard/${user.user._id}`,
      image: <GiClassicalKnowledge color="white" size={30} />,
    });
  }

  const [menuDatas, setMenuDatas] = useState(menuData);

  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/login');
    toast.success('Signed out successfully');
  };

  useEffect(() => {
    setMenuDatas(menuData);
  }, [user]);

  return (
    <div className="bg-black text-white min-h-[40vh] min-w-[20vw] absolute p-8 top-[140%] right-0 rounded-[32px] border border-gray-800 overflow-hidden">
      <div>
        <div className="flex justify-center items-center gap-3 border-b border-paraColor pb-2">
          <div className="font-sans font-semibold">
            {isSignIn ? (
              <Link to="/signin" onClick={handleSignOut}>
                Sign Out
              </Link>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
          </div>
          {isSignIn ? (
            <LiaSignOutAltSolid color="white" size={30} />
          ) : (
            <PiSignInThin color="white" size={30} />
          )}
        </div>
      </div>
      <div className="gap-10 flex flex-col justify-center mt-5">
        {menuDatas.map((data) => (
          <div
            className="flex justify-between items-center gap-8 pb-4"
            key={data.id}
          >
            <Link to={data.link}>
              <div className="font-sans font-semibold text-white text-[1.2rem] hover:text-secondary">
                {data.name}
              </div>
            </Link>
            <div>{data.image}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
