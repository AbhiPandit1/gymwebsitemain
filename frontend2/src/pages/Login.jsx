import { useState } from 'react';
import loginImage from '../assets/loginImage.png';
import { CiMail } from 'react-icons/ci';
import { FaLock } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import LoginLogo from '../component/LoginLogo';
import { useDispatch } from 'react-redux';
import { signInuser } from '../action/userActions';
import SmallSpinner from '../../SmallSpinner';

const Login = () => {
  const [seePassword, setSeePassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signField, setSignField] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    terms: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearErrors = () => {
    setErrors({
      email: '',
      password: '',
      terms: '',
    });
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      terms: '',
    };

    if (!signField.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    }
    if (!signField.password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }
    if (!agreedTerms) {
      newErrors.terms = 'You must agree to the terms and conditions.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      // Clear errors after 5 seconds
      setTimeout(clearErrors, 5000);
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(signInuser(signField));
      console.log(response.data);

      if (response.status === 201) {
        navigate('/');
      } else {
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors({
        ...errors,
        email: 'An error occurred. Please try again.',
      });
      // Clear errors after 5 seconds
      setTimeout(clearErrors, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] bg-primary pt-10 pl-10 pr-10 pb-10 sm:p-4 overflow-scroll scrollbar-hide">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2">
        <div className="flex flex-col pt-[3%] gap-6">
          <LoginLogo />

          <div className="flex flex-col sm:ml-[22%]">
            <label htmlFor="email" className="text-white">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={signField.email}
                onChange={(e) =>
                  setSignField({ ...signField, email: e.target.value })
                }
                className="w-full sm:w-[80%] text-white bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans"
                aria-describedby="email-error"
              />
              <div className="absolute top-[20%] left-[4%]">
                <CiMail color="white" size={25} />
              </div>
            </div>
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:ml-[22%]">
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={seePassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={signField.password}
                onChange={(e) =>
                  setSignField({ ...signField, password: e.target.value })
                }
                className="w-full sm:w-[80%] text-white bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans"
                aria-describedby="password-error"
              />
              <div className="absolute top-[20%] left-[4%]">
                <FaLock color="white" size={25} />
              </div>
              <div
                className="absolute right-[10%] sm:right-[23%] top-[20%] cursor-pointer"
                onClick={() => setSeePassword((prev) => !prev)}
                aria-label={seePassword ? 'Hide password' : 'Show password'}
              >
                {seePassword ? (
                  <AiOutlineEye color="white" size={25} />
                ) : (
                  <AiOutlineEyeInvisible color="white" size={25} />
                )}
              </div>
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 w-full mt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedTerms}
                onChange={() => setAgreedTerms(!agreedTerms)}
                className="cursor-pointer"
                aria-labelledby="terms-label"
              />
              <label
                id="terms-label"
                htmlFor="terms"
                className="text-white text-[0.7rem] sm:text-xl cursor-pointer"
              >
                Agree with terms and conditions
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
            )}
          </div>

          <div className="flex justify-center items-center text-white sm:ml-[10%]">
            <button
              type="submit"
              className="h-[3rem] w-[80%] bg-secondary rounded-xl"
            >
              {loading ? <SmallSpinner /> : 'Log In'}
            </button>
          </div>

          <div className="flex justify-end items-center pr-[20%] sm:pr-[30%]">
            <div className="text-sans text-white text-[0.9rem] pr-[2%]">
              Already have an account?
            </div>
            <div className="text-sans text-secondary text-[0.9rem]">
              <Link to="/signin">Sign In</Link>
            </div>
          </div>

          <div className="flex justify-center text-green-600 text-sans text-[1.2rem] font-extrabold">
            <Link to="/user/forgot/email">Forgot Password?</Link>
          </div>
        </div>

        <div className="pt-[5%] rounded-[32px] hidden sm:flex">
          <img
            src={loginImage}
            alt="bodybuilder"
            className="rounded-[12px] border h-full"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
