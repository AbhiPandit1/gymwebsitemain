import React from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { BiCategoryAlt } from 'react-icons/bi';
import { MdSportsGymnastics } from 'react-icons/md';
import { GiClassicalKnowledge } from 'react-icons/gi';
import { useSelector } from 'react-redux';

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

const NewMenu = () => {
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
  }

  return (
    <div className="flex justify-around items-center font-extrabold bg-gray-500 opacity-95 gap-5 w-[90%] h-[3rem] m-[4%] absolute rounded-lg  shadow-lg">
      {menuItems.map((item) => (
        <a
          key={item.id}
          href={item.link}
          className="flex flex-col items-center text-white  no-underline hover:text-gray-300 transition-colors duration-300"
        >
          <span className="text-md  font-extrabold">{item.name}</span>
        </a>
      ))}
    </div>
  );
};

export default NewMenu;
