import { useState } from 'react';
import Modal from 'react-modal';
import loginImage from '../assets/loginImage.png';
import { CiMail } from 'react-icons/ci';
import { FaLock } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import LoginLogo from '../component/LoginLogo';
import { useDispatch } from 'react-redux';
import { signInuser } from '../action/userActions';
import SmallSpinner from '../../SmallSpinner';
import LoginSkeleton from './skeletons/LoginSkeleton';

import LoadingSpinner from '../../LoadingSpinner';

Modal.setAppElement('#root');

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
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const backgroundStyle = {
    background: 'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)'
  };

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
    } else if (!/\S+@\S+\.\S+/.test(signField.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    
    if (!signField.password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (signField.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
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
      setTimeout(clearErrors, 5000);
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(signInuser(signField));
      
      if (response?.status === 201) {
        navigate('/');
      } else {
        setErrors({
          ...errors,
          email: 'Invalid credentials. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors({
        ...errors,
        email: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
      setTimeout(clearErrors, 5000);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      {loading ? (
        <LoginSkeleton />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 min-h-screen overflow-auto font-bebes py-10 px-4 sm:px-10">
            <div className="flex flex-col pt-8 gap-6 sm:gap-8">
              <LoginLogo header="Log in" />

              {/* Email Field */}
              <div className="flex flex-col sm:ml-20">
                <label htmlFor="email" className="text-white text-[1rem] sm:text-[1.5rem] w-[full] mt-[2rem] pl-5 pb-3 font-semibold">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full sm:w-4/5 text-white bg-tertiary h-12 sm:h-12 rounded-full pl-12 font-sans border border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                    value={signField.email}
                    onChange={(e) => setSignField({ ...signField, email: e.target.value })}
                  />
                  <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                    <CiMail color="white" size={25} />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 pl-5">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col sm:ml-20">
                <label htmlFor="password" className="text-white text-[1rem] sm:text-[1.5rem] pl-5 pb-3 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={seePassword ? 'text' : 'password'}
                    id="password"
                    className="w-full sm:w-4/5 text-white bg-tertiary h-12 sm:h-12 rounded-full pl-12 font-sans border border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                    value={signField.password}
                    onChange={(e) => setSignField({ ...signField, password: e.target.value })}
                  />
                  <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                    <FaLock color="white" size={25} />
                  </div>
                  <div
                    className="absolute right-4 sm:right-[25%] top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setSeePassword(!seePassword)}
                  >
                    {!seePassword ? (
                      <AiOutlineEyeInvisible color="white" size={25} />
                    ) : (
                      <AiOutlineEye color="white" size={25} />
                    )}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 pl-5">{errors.password}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex flex-col sm:ml-20">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedTerms}
                    onChange={() => setAgreedTerms(!agreedTerms)}
                    className="text-orange-600 rounded focus:ring-orange-500"
                  />
                  <Link to="/programpanda/privacy/terms">
                    <label htmlFor="terms" className="text-white text-lg font-semibold">
                      I agree to the{' '}
                      <span className="text-orange-600 cursor-pointer hover:text-orange-500">
                        terms and conditions
                      </span>
                    </label>
                  </Link>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1 pl-5">{errors.terms}</p>
                )}
              </div>

              {/* Login Button */}
              <div className="flex flex-col sm:ml-20">
                <button
                  type="submit"
                  className="w-full sm:w-4/5 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold text-lg hover:bg-orange-700 transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? <SmallSpinner /> : 'Log In'}
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col justify-center items-center gap-5">
                <p className="text-white text-lg">
                  Don't have an account?{' '}
                  <Link to="/signin" className="text-orange-600 font-semibold hover:text-orange-500">
                    Sign Up
                  </Link>
                </p>
                <Link to="/user/forgot/email">
                  <p className="text-sans text-xl text-green-500 hover:text-green-600 transition-colors duration-200">
                    Forgot password?
                  </p>
                </Link>
              </div>
            </div>

            {/* Right side image */}
            <div className="hidden sm:flex items-center justify-center">
              <img
                src={loginImage}
                alt="Login Illustration"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;