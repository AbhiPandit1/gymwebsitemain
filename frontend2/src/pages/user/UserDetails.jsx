import { FaUser, FaPlus, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import LoginLogo from '../../component/LoginLogo';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserDetail } from '../../action/userActions';
import SmallSpinner from '../../../SmallSpinner';
import SocialMediaLinkChange from '../Setting/Component/SocialMediaLinkChange'; // Ensure this component is imported

const UserDetails = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // State to hold the file object
  const [profilePhotoName, setProfilePhotoName] = useState(''); // State to hold the file name
  const [loading, setLoading] = useState(false);

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

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };

  const handleUserDetailSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('gender', gender);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto); // Append the file object

    try {
      setLoading(true);
      const response = await dispatch(updateUserDetail(formData, userId));

      if (response.user) {
        toast.success('User updated successfully');
        console.log(response.user._id);
        response.user.role === 'trainer'
          ? navigate(`/trainer/about/${response.user._id}`)
          : navigate('/programmes');
      } else {
        toast.error('Access Denied');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error?.response?.data?.error || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pt-4 gap-6 min-h-screen bg-gray-800 p-4">
      {/* Login Logo */}
      <Link to="/home" className="mb-4">
        <LoginLogo />
      </Link>

      {/* Form */}
      {user ? (
        <form
          className="flex flex-col items-center justify-center mx-auto max-w-md w-full bg-gray-900 p-6 rounded-lg shadow-lg border border-orange-600"
          onSubmit={handleUserDetailSubmit}
        >
          {/* Upload Profile Photo */}
          <div className="flex flex-col items-center mb-4">
            <label className="bg-orange-600 border-b border-dotted border-gray-500 w-full max-w-xs h-20 flex flex-col justify-center items-center cursor-pointer rounded-2xl p-2 relative">
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
            <p className="mt-2 text-white font-sans text-lg font-bold">
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
              {['trainer', 'user'].map((roleType) => (
                <div
                  key={roleType}
                  className={`h-12 w-28 flex items-center justify-center rounded-lg cursor-pointer ${
                    role === roleType
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                  onClick={() => handleRoleChange(roleType)}
                >
                  {roleType.charAt(0).toUpperCase() + roleType.slice(1)}
                </div>
              ))}
            </div>
          </div>

          {/* Gender Selection */}
          <div className="flex flex-col items-center w-full mb-4">
            <p className="text-white mb-2">Gender</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['male', 'female', 'others'].map((genderType) => (
                <div
                  key={genderType}
                  className={`h-12 w-24 flex items-center justify-center rounded-lg cursor-pointer ${
                    gender === genderType
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                  onClick={() => handleGenderChange(genderType)}
                >
                  {genderType.charAt(0).toUpperCase() + genderType.slice(1)}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center mt-6 w-full">
            <button
              type="submit"
              className="w-full h-12 bg-orange-600 text-white rounded-lg font-sans font-bold hover:bg-orange-700"
            >
              {!loading ? 'Next' : <SmallSpinner />}
            </button>
          </div>
          {user.role === 'trainer' && (
            <div className="flex justify-center items-center mt-4">
              <Link
                to="/settings"
                className="text-white underline hover:text-orange-400"
              >
                Update your social media links
              </Link>
            </div>
          )}
        </form>
      ) : (
        <p className="text-white text-center">...Loading</p>
      )}
    </div>
  );
};

export default UserDetails;
