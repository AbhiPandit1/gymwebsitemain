import { FaUser } from 'react-icons/fa';
import { useState } from 'react';
import LoginLogo from '../../component/LoginLogo';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserDetail } from '../../action/userActions';

const UserDetails = () => {
  {
    /*/user/detail/:id */
  }
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // State to hold the file object

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const { user } = useSelector((state) => state.user.user);

  const userId = user._id;

  // Handle file input change
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0]; // Access the file object
    setProfilePhoto(file);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleUserDetailSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to append data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('gender', gender);
    formData.append('profilePhoto', profilePhoto); // Append the file object

    try {
      const response = await dispatch(updateUserDetail(formData, userId));

      const { user, token } = response;

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
    <>
      <div className="flex flex-col pt-[3%] gap-6 min-h-[100vh]">
        {/* Login Logo */}
        <Link to="/home">
          <LoginLogo />
        </Link>

        {/* Upload Profile Photo */}
        {user ? (
          <>
            {' '}
            <form
              className="flex flex-col items-center justify-center"
              onSubmit={handleUserDetailSubmit}
            >
              <div className="bg-black w-30 h-20 flex flex-row justify-center items-center cursor-pointer border rounded-[32px] p-2 pt-5">
                <div className="flex justify-center items-center gap-2 mr-2">
                  <label htmlFor="upload-input" className="relative text-white">
                    <input
                      id="upload-input"
                      name="profilePhoto"
                      type="file"
                      className="hidden"
                      onChange={handleProfilePhotoChange} // Handle file change
                    />
                    <span className="text-white text-4xl flex justify-center items-center">
                      +
                    </span>
                  </label>
                </div>
                <div className="flex justify-center items-center pb-[10%]">
                  <p className="mt-2 text-white font-sans text-[1rem] font-extrabold">
                    Upload Profile Photo
                  </p>
                </div>
              </div>
            </form>
            {/* Name Input */}
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="name" className="text-white">
                Name
              </label>
              <div className="relative flex w-[80%] justify-center">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full sm:w-[40%] text-white bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[20%] sm:pl-[8%] font-sans"
                />
                <div className="absolute top-[20%] left-[10%] sm:left-[33%]">
                  <FaUser color="white" size={25} />
                </div>
              </div>
            </div>
            {/* Role Selection */}
            <div className="flex justify-center items-center gap-6">
              <p className="text-white">I am a...</p>
              {/* Checkbox for Trainer */}
              <div
                className={`h-[3.5rem] w-[8rem] ${
                  role === 'trainer' ? 'bg-secondary' : 'bg-black border'
                } rounded-2xl px-4 flex justify-between items-center`}
                onClick={() => setRole('trainer')}
              >
                <input
                  type="checkbox"
                  value="trainer"
                  checked={role === 'trainer'}
                  onChange={handleRoleChange}
                />
                <div
                  className={`${
                    role === 'trainer' ? 'text-white' : 'text-paraColor'
                  } font-sans font-extrabold`}
                >
                  Trainer
                </div>
              </div>

              {/* Checkbox for User */}
              <div
                className={`h-[3.5rem] w-[8rem] ${
                  role === 'user' ? 'bg-secondary' : 'bg-black border'
                } rounded-2xl px-4 flex justify-between items-center`}
                onClick={() => setRole('user')}
              >
                <input
                  type="checkbox"
                  value="user"
                  checked={role === 'user'}
                  onChange={handleRoleChange}
                />
                <div
                  className={`${
                    role === 'user' ? 'text-white' : 'text-paraColor'
                  } font-sans font-extrabold`}
                >
                  User
                </div>
              </div>
            </div>
            {/* Gender Selection */}
            <div className="flex justify-center items-center gap-2">
              <p className="text-white">Gender</p>
              {/* Male Checkbox */}
              <div
                className={`h-[3.5rem] w-[6rem] ${
                  gender === 'male' ? 'bg-secondary' : 'bg-black border'
                } rounded-2xl px-4 flex justify-between items-center`}
                onClick={() => setGender('male')}
              >
                <input
                  type="checkbox"
                  value="male"
                  checked={gender === 'male'}
                  onChange={handleGenderChange}
                />
                <div
                  className={`${
                    gender === 'male' ? 'text-white' : 'text-paraColor'
                  } font-sans font-extrabold`}
                >
                  Male
                </div>
              </div>

              {/* Female Checkbox */}
              <div
                className={`h-[3.5rem] w-[6rem] ${
                  gender === 'female' ? 'bg-secondary' : 'bg-black border'
                } rounded-2xl px-4 flex justify-between items-center`}
                onClick={() => setGender('female')}
              >
                <input
                  type="checkbox"
                  value="female"
                  checked={gender === 'female'}
                  onChange={handleGenderChange}
                />
                <div
                  className={`${
                    gender === 'female' ? 'text-white' : 'text-paraColor'
                  } font-sans font-extrabold`}
                >
                  Female
                </div>
              </div>

              {/* Others Checkbox */}
              <div
                className={`h-[3.5rem] w-[6rem] ${
                  gender === 'others' ? 'bg-secondary' : 'bg-black border'
                } rounded-2xl px-4 flex justify-between items-center`}
                onClick={() => setGender('others')}
              >
                <input
                  type="checkbox"
                  value="others"
                  checked={gender === 'others'}
                  onChange={handleGenderChange}
                />
                <div
                  className={`${
                    gender === 'others' ? 'text-white' : 'text-paraColor'
                  } font-sans font-extrabold`}
                >
                  Others
                </div>
              </div>
            </div>
            {/* Button */}
            <div className="flex justify-center items-center">
              <button
                className="h-[3.5rem] w-[10rem] bg-secondary text-white rounded-xl"
                onClick={handleUserDetailSubmit}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          '...Loading'
        )}
      </div>
    </>
  );
};

export default UserDetails;
