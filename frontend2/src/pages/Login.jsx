import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedTerms) {
      toast.error('Please read and agree to the terms and conditions.');
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(signInuser(signField));

      if (response.status === 201) {
        navigate('/');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[100vh] bg-primary pt-10 pl-10 pr-10 pb-10 sm:p-4 ">
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
                  className={`flex w-full sm:w-[80%] justify-center items-center text-white bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans`}
                />
                <div className="absolute top-[20%] left-[4%]">
                  <CiMail color="white" size={25} />
                </div>
              </div>
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
                  className={`flex w-full sm:w-[80%] justify-center text-white items-center bg-tertiary h-[2.5rem] sm:h-[3rem] rounded-[32px] pl-[15%] sm:pl-[10%] font-sans`}
                />
                <div className="absolute top-[20%] left-[4%]">
                  <FaLock color="white" size={25} />
                </div>
                <div
                  className="absolute right-[10%] sm:right-[23%] top-[20%]"
                  onClick={() => setSeePassword((prev) => !prev)}
                >
                  {!seePassword ? (
                    <AiOutlineEyeInvisible color="white" size={25} />
                  ) : (
                    <AiOutlineEye color="white" size={25} />
                  )}
                </div>
              </div>

              <div className="flex justify-between w-full mt-2">
                <div className="flex gap-4 justify-between items-center w-full ">
                  <div className="flex justify-between items-center gap-8">
                    <div className=" flex gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedTerms}
                        onChange={() => setAgreedTerms(!agreedTerms)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-white text-[0.7rem] sm:text-xl"
                      >
                        Agree with terms and conditions
                      </label>
                    </div>
                    <div>
                      <Link to="/user/forgot/email">
                        <p className="text-sans text-green-500 hover:text-green-700">
                          forgot password
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center text-white sm:ml-[10%]">
              <button className="h-[3rem] w-[80%] bg-secondary rounded-xl">
                {loading ? <SmallSpinner /> : 'Log In'}
              </button>
            </div>

            <div className="flex justify-end items-center pr-[20%] sm:pr-[30%]">
              <div className="text-sans text-white pr-[2%]">
                Dont have an account?
              </div>
              <div className="text-sans text-secondary">
                <Link to="/signin">Log In</Link>
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

export default Login;
