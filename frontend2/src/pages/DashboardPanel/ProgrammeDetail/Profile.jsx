import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

  // Convert ISO string to a Date object
  const isoDate = user.user.createdAt;
  const date = new Date(isoDate);

  // Extract date components
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Months are zero-based in JavaScript, so add 1
  const year = date.getUTCFullYear();

  // Extract time components
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  // Format the date and time into a readable string
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  console.log(formattedDate);

  return (
    <div className="w-[95%] sm:w-[80%] h-full sm:h-[50%] bg-gradient-to-r from-green-600 to-green-400 rounded-lg m-auto border shadow-lg shadow-green-300 p-6 flex flex-col items-center justify-center transform transition-transform hover:scale-105">
      {/* Profile Image */}
      <div className="w-24 h-24 rounded-full  shadow-md border-4 border-white mb-4">
        <img
          src={user.user.profilePhoto.url} // Placeholder image URL
          alt="Profile"
          className="w-full h-full rounded-full"
        />
      </div>

      {/* Profile Information */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{user.user.name}</h2>
        <p className="text-sm text-white font-light">Joined: {formattedDate}</p>
      </div>

      {/* Additional Profile Details */}
      <div className="mt-4 text-center">
        <p className="text-md text-white font-medium">
          Email: {user.user.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
