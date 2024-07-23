import { FaUser, FaPlus, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import LoginLogo from '../../component/LoginLogo';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserDetail } from '../../action/userActions';

const UserDetails = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // State to hold the file object
  const [profilePhotoName, setProfilePhotoName] = useState(''); // State to hold the file name

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user.user);
  const userId = user?._id;

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setProfilePhotoName(file ? file.name : ''); // Update file name
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleUserDetailSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('gender', gender);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto); // Append the file object

    try {
      const response = await dispatch(updateUserDetail(formData, userId));

      const { user } = response;

      if (user) {
        toast.success('User updated successfully');
        navigate('/programmes');
      } else {
        toast.error('Access Denied');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="flex flex-col pt-4 gap-6 min-h-screen bg-primary p-4">
      {/* Login Logo */}
      <Link to="/home" className="mb-4">
        <LoginLogo />
      </Link>

      {/* Form */}
      {user ? (
        <form
          className="flex flex-col items-center justify-center mx-auto max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg"
          onSubmit={handleUserDetailSubmit}
        >
          {/* Upload Profile Photo */}
          <div className="flex flex-col items-center mb-4">
            <label className="bg-black w-full max-w-xs h-20 flex flex-col justify-center items-center cursor-pointer border rounded-2xl p-2 relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                name="profilePhoto"
                onChange={handleProfilePhotoChange}
              />
              {profilePhotoName ? (
                <div className="flex items-center gap-2">
                  <h1 className="text-white font-sans truncate">
                    {profilePhotoName}
                  </h1>
                  <button
                    type="button"
                    className="text-white"
                    onClick={() => {
                      setProfilePhoto(null);
                      setProfilePhotoName('');
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <FaPlus size={40} color="white" />
                  <h1 className="text-white font-sans">Upload Photo</h1>
                </>
              )}
            </label>
            <p className="mt-2 text-white font-sans text-lg font-extrabold">
              Upload Profile Photo
            </p>
          </div>

          {/* Name Input */}
          <div className="flex flex-col w-full mb-4">
            <label htmlFor="name" className="text-white mb-1">
              Name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full text-white bg-gray-700 h-12 rounded-lg pl-12 font-sans"
              />
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                <FaUser color="white" size={20} />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="flex flex-col items-center w-full mb-4">
            <p className="text-white mb-2">I am a...</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div
                className={`h-12 w-28 flex items-center justify-center rounded-lg cursor-pointer ${
                  role === 'trainer'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setRole('trainer')}
              >
                Trainer
              </div>
              <div
                className={`h-12 w-28 flex items-center justify-center rounded-lg cursor-pointer ${
                  role === 'user'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setRole('user')}
              >
                User
              </div>
            </div>
          </div>

          {/* Gender Selection */}
          <div className="flex flex-col items-center w-full mb-4">
            <p className="text-white mb-2">Gender</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div
                className={`h-12 w-24 flex items-center justify-center rounded-lg cursor-pointer ${
                  gender === 'male'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setGender('male')}
              >
                Male
              </div>
              <div
                className={`h-12 w-24 flex items-center justify-center rounded-lg cursor-pointer ${
                  gender === 'female'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setGender('female')}
              >
                Female
              </div>
              <div
                className={`h-12 w-24 flex items-center justify-center rounded-lg cursor-pointer ${
                  gender === 'others'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setGender('others')}
              >
                Others
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center mt-6 w-full">
            <button
              type="submit"
              className="w-full h-12 bg-secondary text-white rounded-lg font-sans font-bold"
            >
              Next
            </button>
          </div>
        </form>
      ) : (
        <p className="text-white text-center">...Loading</p>
      )}
    </div>
  );
};

export default UserDetails;
