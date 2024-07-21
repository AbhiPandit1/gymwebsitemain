import { useSelector } from 'react-redux';

const useDashboardLinks = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user.user.role);
  console.log(user.user._id);

  // Compute the link based on the user's role
  const programLink =
    user.user.role === 'user'
      ? '/user/programmes'
      : `/trainer/programmes/${user.user._id}`;

  return [
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
};

export default useDashboardLinks;
