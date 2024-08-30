import { BiHome } from 'react-icons/bi';
import { CgGym } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { TbInvoice, TbUserSquareRounded } from 'react-icons/tb';
import { IoSettingsOutline } from 'react-icons/io5';
import { CiEdit } from 'react-icons/ci';

const useDashboardLinks = () => {
  const { user } = useSelector((state) => state.user);

  const programLink =
    user.user.role === 'user'
      ? '/user/programmes'
      : `/trainer/programmes/${user.user._id}`;

  const userLinks = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      role: 'user',
      icon: <BiHome size={40} color="orange" />, // Added color
    },
    {
      id: '2',
      name: 'Programs',
      link: programLink,
      role: '',
      icon: <CgGym size={40} color="orange" />, // Added color
    },
    {
      id: '3',
      name: 'Settings',
      link: '/settings',
      icon: <IoSettingsOutline size={40} color="orange" />, // Added color
    },
    {
      id: '4',
      name: 'Edit',
      link: `/user/detail/${user.user._id}`,
      icon: <CiEdit size={40} color="orange" />, // Added color
    },
  ];

  const adminLinks = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      role: 'admin',
      icon: <BiHome size={40} color="orange" />, // Added color
    },
    {
      id: '2',
      name: 'Programmes',
      link: '/admin/programmes',
      icon: <CgGym size={40} color="orange" />, // Added color
    },
    {
      id: '3',
      name: 'Users',
      link: '/admin/user',
      icon: <TbUserSquareRounded size={40} color="orange" />, // Added color
    },
    {
      id: '4',
      name: 'Invoices',
      link: '/admin/invoices',
      icon: <TbInvoice size={40} color="orange" />, // Added color
    },
    {
      id: '5',
      name: 'Settings',
      link: '/settings',
      icon: <IoSettingsOutline size={40} color="orange" />, // Added color
    },
    {
      id: '6',
      name: 'Advertisement',
      link: `/admin/ads/mail`,
      icon: <CiEdit size={40} color="orange" />, // Added color
    },
  ];

  return user.user.role === 'admin' ? adminLinks : userLinks;
};

export default useDashboardLinks;
