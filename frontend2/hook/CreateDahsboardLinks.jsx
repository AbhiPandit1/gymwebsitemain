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
      icon: <BiHome size={30} color="orange" />,
    },
    {
      id: '2',
      name: 'Programs',
      link: programLink,
      role: '',
      icon: <CgGym size={30} color="orange" />,
    },
    {
      id: '3',
      name: 'Settings',
      link: '/settings',
      icon: <IoSettingsOutline size={30} color="orange" />,
    },
    {
      id: '4',
      name: 'Invoices',
      link: '/user/payment/invoice',
      icon: <TbInvoice size={30} color="orange" />,
    },
    {
      id: '4',
      name: 'Edit',
      link: `/user/detail/${user.user._id}`,
      icon: <CiEdit size={30} color="orange" />,
    },
  ];

  const trainerLinks = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      role: 'user',
      icon: <BiHome size={30} color="orange" />,
    },
    {
      id: '2',
      name: 'Programs',
      link: programLink,
      role: '',
      icon: <CgGym size={30} color="orange" />,
    },
    {
      id: '3',
      name: 'Settings',
      link: '/settings',
      icon: <IoSettingsOutline size={30} color="orange" />,
    },

    {
      id: '4',
      name: 'Edit',
      link: `/user/detail/${user.user._id}`,
      icon: <CiEdit size={30} color="orange" />,
    }, // Include all user links
    {
      id: '5',
      name: 'Revenue',
      link: `/payment/invoices/${user.user._id}`,
      icon: <TbInvoice size={30} color="orange" />,
    },
  ];

  const adminLinks = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      role: 'admin',
      icon: <BiHome size={30} color="orange" />,
    },
    {
      id: '2',
      name: 'Programmes',
      link: '/admin/programmes',
      icon: <CgGym size={30} color="orange" />,
    },
    {
      id: '3',
      name: 'Users',
      link: '/admin/user',
      icon: <TbUserSquareRounded size={30} color="orange" />,
    },
    {
      id: '4',
      name: 'Invoices',
      link: '/admin/invoices',
      icon: <TbInvoice size={30} color="orange" />,
    },
    {
      id: '5',
      name: 'Settings',
      link: '/settings',
      icon: <IoSettingsOutline size={30} color="orange" />,
    },
    {
      id: '6',
      name: 'Advertisement',
      link: `/admin/ads/mail`,
      icon: <CiEdit size={30} color="orange" />,
    },
  ];

  switch (user.user.role) {
    case 'admin':
      return adminLinks;
    case 'trainer':
      return trainerLinks;
    case 'user':
    default:
      return userLinks;
  }
};

export default useDashboardLinks;
