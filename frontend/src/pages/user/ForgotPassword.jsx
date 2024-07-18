import LoginLogo from '../../component/LoginLogo';
import { useState } from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { MdPassword } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';

<<<<<<< HEAD:frontend/src/pages/user/ForgotPassword.jsx

const api = import.meta.env.VITE_BACKEND_URL;
=======
const backendapi = import.meta.env.VITE_BACKEND_URL;

>>>>>>> 7b51c01e35a79bcccdd54a45a56cbe0623c4ccc4:frontend2/src/pages/user/ForgotPassword.jsx
const ForgortPassword = () => {
  {
    /* "/resetpassword/:token" */
  }
  const [userPassword, setUserPassword] = useState('');
  const [userConfirmPassword, setUserConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();
  console.log(token);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (userPassword !== userConfirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
<<<<<<< HEAD:frontend/src/pages/user/ForgotPassword.jsx
        const res = await axios.put(`${api}/api/forgot/reset/password/${token}`, {
          newPassword: userPassword,
          confirmNewPassword: userConfirmPassword,
        });
=======
        const res = await axios.put(
          `${backendapi}/api/forgot/reset/password/${token}`,
          {
            newPassword: userPassword,
            confirmNewPassword: userConfirmPassword,
          }
        );
>>>>>>> 7b51c01e35a79bcccdd54a45a56cbe0623c4ccc4:frontend2/src/pages/user/ForgotPassword.jsx

        if (res.data.success) {
          toast.success('Password updated successfully');
        } else {
          toast.error('Error: Password update failed');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Internal Error: Please try again later');
      }
    }
  };

  return (
    <div className="min-h-[100vh] w-full pt-5 flex flex-col gap-10">
      <div>
        <LoginLogo />
      </div>

      <div className="gap-20 max-w-[100vw]">
        <div className="flex flex-col justify-center items-center mt-4 max-w-[100vw]">
          <label htmlFor="" className="text-white">
            Password
          </label>
          <div className="relative flex w-[80%] justify-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              className="flex w-full sm:w-[40%] justify-center items-center text-white bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[20%] sm:pl-[8%] font-sans"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />

            <div className="absolute top-[20%] left-[10%] sm:left-[33%]">
              <MdPassword color="white" size={25} />
            </div>

            <div
              className="absolute top-[20%] right-[10%] sm:right-[33%]"
              onClick={handleShowPassword}
            >
              {showPassword ? (
                <IoMdEyeOff color="white" size={25} />
              ) : (
                <IoMdEye color="white" size={25} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-4 max-w-[100vw]">
          <label htmlFor="confirmPassword" className="text-white flex gap-4">
            Confirm Password
          </label>
          <div className="relative flex w-[80%] justify-center">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full bg-gray-800 text-white rounded-[32px] h-[2.5rem] sm:h-[3rem] pl-[20%] sm:pl-[8%] sm:w-[40%] font-sans"
              value={userConfirmPassword}
              onChange={(e) => setUserConfirmPassword(e.target.value)}
            />
            <div className="absolute top-[20%] left-[10%] sm:left-[33%]">
              <MdPassword color="white" size={25} />
            </div>
            <div
              className="absolute top-[20%] right-[10%] sm:right-[33%]"
              onClick={handleShowConfirmPassword}
            >
              {showConfirmPassword ? (
                <IoMdEyeOff color="white" size={25} />
              ) : (
                <IoMdEye color="white" size={25} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <button
          className="h-[4rem] w-[20rem] rounded-3xl bg-secondary text-white flex justify-center items-center gap-5"
          onClick={handleChangePassword}
        >
          <div className="font-sans font-extrabold">Submit</div>
          <FaLongArrowAltRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default ForgortPassword;
