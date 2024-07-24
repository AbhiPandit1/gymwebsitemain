import { useSelector } from 'react-redux';

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
    },
    {
      id: '2',
      name: 'My Programs',
      link: programLink,
      role: '',
    },
    {
      id: '3',
      name: 'Settings',
      link: '/settings',
    },
    {
      id: '4',
      name: 'Edit',
      link: `/user/detail/${user.user._id}`,
    },
  ];

  const adminLinks = [
    {
      id: '1',
      name: 'Home',
      link: '/',
      role: 'user',
    },
    {
      id: '2',
      name: 'Programmes',
      link: '/admin/programmes',
      role: '',
    },
    {
      id: '3',
      name: 'Users',
      link: '/admin/user',
      role: '',
    },
    {
      id: '4',
      name: 'Invoices',
      link: '/admin/invoices',
      role: '',
    },
    {
      id: '5',
      name: 'Settings',
      link: '/settings',
    },
    {
      id: '6',
      name: 'Edit',
      link: `/admin/detail/${user.user._id}`,
    },
  ];

  return user.user.role === 'admin' ? adminLinks : userLinks;
};

export default useDashboardLinks;
