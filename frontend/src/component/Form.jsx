import loginImage from '../assets/loginImage.png';
import { CiMail } from 'react-icons/ci';
import { FaLock } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { PiEyeBold, PiEyeClosed } from 'react-icons/pi';
import { useState } from 'react';
import LoginLogo from './LoginLogo';

const Form = ({
  isLogin,
  fields,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false); // State for terms checkbox

  const handlePasswordField = () => {
    setSeePassword(!seePassword);
  };

  const handleConfirmPasswordField = () => {
    setSeeConfirmPassword(!seeConfirmPassword);
  };

  const handleTermsChange = (e) => {
    setAgreedTerms(e.target.checked);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[100vh] max-h-[100vh] overflow-hidden bg-primary pt-10 pl-10 pr-10 pb-10 sm:p-4">
        <div className="flex flex-col pt-[3%] gap-6">
          <LoginLogo />

          <div className="flex flex-col sm:ml-[22%]">
            <label htmlFor="" className="text-white">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                className="flex w-full sm:w-[80%] justify-center items-center text-white bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans"
                value={fields.email}
                onChange={onEmailChange}
              />
              <div className="absolute top-[20%] left-[4%]">
                <CiMail color="white" size={25} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:ml-[22%]">
            <label htmlFor="" className="text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={seePassword ? 'text' : 'password'}
                className="flex w-full sm:w-[80%] justify-center text-white items-center bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans"
                value={fields.password}
                onChange={onPasswordChange}
              />
              <div className="absolute top-[20%] left-[4%]">
                <FaLock color="white" size={25} />
              </div>
              <div
                className="absolute right-[10%] sm:right-[23%] top-[20%]"
                onClick={handlePasswordField}
              >
                {seePassword ? (
                  <PiEyeBold color="white" size={25} />
                ) : (
                  <PiEyeClosed color="white" size={25} />
                )}
              </div>
            </div>
          </div>

          {isLogin && (
            <div className="flex flex-col sm:ml-[22%]">
              <label htmlFor="" className="text-white">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={seeConfirmPassword ? 'text' : 'password'}
                  className="flex w-full sm:w-[80%] justify-center text-white items-center bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans"
                  value={fields.confirmPassword}
                  onChange={onConfirmPasswordChange}
                />
                <div className="absolute top-[20%] left-[4%]">
                  <FaLock color="white" size={25} />
                </div>
                <div
                  className="absolute right-[10%] sm:right-[23%] top-[20%]"
                  onClick={handleConfirmPasswordField}
                >
                  {seeConfirmPassword ? (
                    <PiEyeBold color="white" size={25} />
                  ) : (
                    <PiEyeClosed color="white" size={25} />
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between sm:pl-[20%] sm:pr-[15%]">
            <div className="flex gap-4 justify-center items-center">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={handleTermsChange}
              />
              <h3 className="text-white text-[0.7rem] sm:text-xl">
                Agree with terms and conditions
              </h3>
            </div>

            {!isLogin && (
              <div className="text-secondary font-sans flex justify-center items-center">
                Forget Password
              </div>
            )}
          </div>

          <div className="flex justify-center items-center text-white sm:ml-[10%]">
            <button
              className="h-[3rem] w-[80%] bg-secondary rounded-xl"
              onClick={onSubmit}
              disabled={!agreedTerms} // Disable button if terms not agreed
            >
              Sign Up
            </button>
          </div>

          {isLogin ? (
            <div className="flex justify-end items-center pr-[20%] sm:pr-[30%]">
              <div className="text-sans text-white text-[0.9rem] pr-[2%]">
                Already have an account?
              </div>
              <div className="text-sans text-secondary text-[0.9rem]">
                <Link to="/signin">Sign In</Link>
              </div>
            </div>
          ) : (
            <div className="flex justify-end items-center pr-[20%] sm:pr-[30%]">
              <div className="text-sans text-white pr-[2%]">
                Dont have an account?
              </div>
              <div className="text-sans text-secondary">
                <Link to="/login">Log In</Link>
              </div>
            </div>
          )}
        </div>
        <div className="pt-[5%] rounded-[32px] hidden sm:flex">
          <img
            src={loginImage}
            alt="bodybuilder"
            className="rounded-[12px] border h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Form;
