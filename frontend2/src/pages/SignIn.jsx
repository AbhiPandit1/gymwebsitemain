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

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
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

  const handlePasswordField = () => {
    setSeePassword(!seePassword);
  };

  const handleConfirmPasswordField = () => {
    setSeeConfirmPassword(!seeConfirmPassword);
  };

  const handleTermsChange = (e) => {
    setAgreedTerms(e.target.checked);
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
      newErrors.terms = 'Please agree to the terms and conditions.';
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

      if (response.status === 201) {
        navigate('/');
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
        <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[100vh] overflow-scroll bg-primary pt-10 pl-10 pr-10 pb-10 sm:p-4">
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
                  className="flex w-full sm:w-[80%] justify-center items-center text-white bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans"
                  value={signField.email}
                  onChange={(e) =>
                    setSignField({ ...signField, email: e.target.value })
                  }
                />
                <div className="absolute top-[20%] left-[4%]">
                  <CiMail color="white" size={25} />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
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
                  className="flex w-full sm:w-[80%] justify-center text-white items-center bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans"
                  value={signField.password}
                  onChange={(e) =>
                    setSignField({ ...signField, password: e.target.value })
                  }
                />
                <div className="absolute top-[20%] left-[4%]">
                  <FaLock color="white" size={25} />
                </div>
                <div
                  className="absolute right-[10%] sm:right-[23%] top-[20%]"
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
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col sm:ml-[22%]">
              <label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={seeConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="flex w-full sm:w-[80%] justify-center text-white items-center bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans"
                  value={signField.confirmPassword}
                  onChange={(e) =>
                    setSignField({
                      ...signField,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <div className="absolute top-[20%] left-[4%]">
                  <FaLock color="white" size={25} />
                </div>
                <div
                  className="absolute right-[10%] sm:right-[23%] top-[20%]"
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
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex flex-col justify-center sm:flex-col items-center gap-4 w-full mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={handleTermsChange}
                />
                <div>
                  <label
                    htmlFor="terms"
                    className="text-white text-[0.7rem] sm:text-xl"
                  >
                    Agree with terms and conditions
                  </label>
                </div>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm">{errors.terms}</p>
              )}
            </div>

            <div className="flex justify-center items-center text-white sm:ml-[10%]">
              <button
                type="submit"
                className="h-[3rem] w-[80%] bg-secondary rounded-xl"
              >
                {loading ? <SmallSpinner /> : 'Sign In'}
              </button>
            </div>

            <div className="flex justify-end items-center pr-[20%] sm:pr-[30%]">
              <div className="text-sans text-white text-[0.9rem] pr-[2%]">
                Already have an account?
              </div>
              <div className="text-sans text-secondary text-[0.9rem]">
                <Link to="/login">Log In</Link>
              </div>
            </div>
          </div>
          <div className="pt-[5%] rounded-[32px] hidden sm:flex">
            <img
              src={loginImage}
              alt="bodybuilder"
              className="rounded-[12px] border h-full"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
