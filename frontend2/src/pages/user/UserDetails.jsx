import { FaUser, FaPlus, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import LoginLogo from '../../component/LoginLogo';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserDetail } from '../../action/userActions';
import SmallSpinner from '../../../SmallSpinner';

const UserDetails = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
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

    // Show image preview
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setProfilePhotoPreview(fileReader.result);
    };
    if (file) {
      fileReader.readAsDataURL(file);
    }
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
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    try {
      setLoading(true);
      const response = await dispatch(
        updateUserDetail(formData, userId, (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        })
      );

      if (response.user) {
        toast.success('User updated successfully');
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
      setUploadProgress(0); // Reset progress after the upload
    }
  };

  return (
    <div className="flex flex-col pt-4 gap-6 min-h-screen bg-gray-800 p-4">
      {/* Login Logo */}
      <Link to="/home" className="mb-4">
        <LoginLogo header="" />
      </Link>

      {/* Form */}
      {user ? (
        <form
          className="flex flex-col items-center justify-center mx-auto max-w-md w-full bg-gray-900 p-6 rounded-lg shadow-lg border border-orange-600"
          onSubmit={handleUserDetailSubmit}
        >
          {/* Upload Profile Photo */}
          <div className="flex flex-col items-center mb-4 relative w-full">
            <label className="relative w-full max-w-xs h-20 flex flex-col justify-center items-center cursor-pointer rounded-2xl p-16 bg-gray-700">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                name="profilePhoto"
                onChange={handleProfilePhotoChange}
              />

              {/* Display the preview or upload icon */}
              {profilePhotoPreview ? (
                <>
                  {/* Image Preview inside input */}
                  <img
                    src={profilePhotoPreview}
                    alt="Profile Preview"
                    className="absolute top-3 h-[80%] w-[50%] p-2 rounded-full object-cover "
                  />
                  {/* Remove Image Button */}
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full"
                    onClick={() => {
                      setProfilePhoto(null);
                      setProfilePhotoPreview('');
                      setUploadProgress(0);
                    }}
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  {/* Icon and Text */}

                  <h1 className="text-white font-sans">
                    <FaPlus size={40} color="white" />
                  </h1>
                </>
              )}
            </label>

            {/* Display upload percentage inside the input box */}
            {uploadProgress > 0 && (
              <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-lg">
                {`${uploadProgress}%`}
              </div>
            )}

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
