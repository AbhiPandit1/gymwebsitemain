import { useState } from 'react';
import loginImage from '../assets/loginImage.png';
import { CiMail } from 'react-icons/ci';
import { FaLock } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import LoginLogo from '../component/LoginLogo';
import { useDispatch } from 'react-redux';
import { registerUser } from '../action/userActions';
import SmallSpinner from '../../SmallSpinner';
import Modal from 'react-modal';

// Ensure to call Modal.setAppElement() to avoid accessibility issues
Modal.setAppElement('#root');

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [reviewedTerms, setReviewedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signField, setSignField] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handlePasswordField = () => {
    setSeePassword(!seePassword);
  };

  const handleConfirmPasswordField = () => {
    setSeeConfirmPassword(!seeConfirmPassword);
  };

  const handleTermsChange = (e) => {
    setAgreedTerms(e.target.checked);
  };

  const handleReviewTerms = () => {
    setModalIsOpen(true);
    setReviewedTerms(true);
  };

  const clearErrors = () => {
    setErrors({
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
    };

    if (!signField.email) {
      newErrors.email = 'Email is required.';
      valid = false;
    }

    if (!signField.password) {
      newErrors.password = 'Password is required.';
      valid = false;
    }

    if (signField.password !== signField.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    if (!agreedTerms) {
      newErrors.terms =
        'Please agree to the terms and conditions after reviewing them.';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      // Clear errors after 5 seconds
      setTimeout(clearErrors, 5000);
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(registerUser(signField));

      if (response.status) {
        navigate(`/user/detail/${response.data.user._id}`);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Registration failed. Please try again.',
        }));
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'An error occurred. Please try again.',
      }));
    } finally {
      setLoading(false);
      // Clear errors after 5 seconds
      setTimeout(clearErrors, 5000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 font-bebes min-h-screen overflow-auto  py-10 px-4 sm:px-10"
          style={{
            background:
              'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
          }}
        >
          <div className="flex flex-col pt-8 gap-6 sm:gap-8">
            <LoginLogo header="Sign up" />

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
                  onChange={(e) =>
                    setSignField({ ...signField, email: e.target.value })
                  }
                />
                <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                  <CiMail color="white" size={25} />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col sm:ml-20">
              <label
                htmlFor="password"
                className="text-white text-[1rem] sm:text-[1.5rem] pl-5 pb-3 font-semibold"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={seePassword ? 'text' : 'password'}
                  id="password"
                  className="w-full sm:w-4/5 text-white bg-tertiary h-12 sm:h-12 rounded-full pl-12 font-sans border border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                  value={signField.password}
                  onChange={(e) =>
                    setSignField({ ...signField, password: e.target.value })
                  }
                />
                <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                  <FaLock color="white" size={25} />
                </div>
                <div
                  className="absolute right-4 sm:right-[25%] top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={handlePasswordField}
                >
                  {!seePassword ? (
                    <AiOutlineEyeInvisible color="white" size={25} />
                  ) : (
                    <AiOutlineEye color="white" size={25} />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col sm:ml-20">
              <label
                htmlFor="confirmPassword"
                className="text-white text-[1rem] sm:text-[1.5rem] pl-5 pb-3 font-semibold"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={seeConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full sm:w-4/5 text-white bg-tertiary h-12 sm:h-12 rounded-full pl-12 font-sans border border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                  value={signField.confirmPassword}
                  onChange={(e) =>
                    setSignField({
                      ...signField,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                  <FaLock color="white" size={25} />
                </div>
                <div
                  className="absolute right-4 sm:right-[25%] top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={handleConfirmPasswordField}
                >
                  {!seeConfirmPassword ? (
                    <AiOutlineEyeInvisible color="white" size={25} />
                  ) : (
                    <AiOutlineEye color="white" size={25} />
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:ml-20">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={handleTermsChange}
                  className="text-orange-600"
                />
                <Link to="/programpanda/privacy/terms">
                  <label
                    htmlFor="terms"
                    className="text-white text-lg font-semibold"
                  >
                    I agree to the{' '}
                    <span
                      onClick={handleReviewTerms}
                      className="text-orange-600 cursor-pointer"
                    >
                      terms and conditions
                    </span>
                  </label>
                </Link>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
              )}
            </div>

            <div className="flex flex-col sm:ml-20">
              <button
                type="submit"
                className="w-full sm:w-4/5 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold text-lg"
                disabled={loading}
              >
                {loading ? <SmallSpinner /> : 'Sign Up'}
              </button>
            </div>

            <div className="flex justify-center items-center flex-col">
              <p className="text-white text-lg">
                Already have an account?{' '}
                <Link to="/login" className="text-orange-600 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-center">
            <img
              src={loginImage}
              alt="Login Illustration"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
