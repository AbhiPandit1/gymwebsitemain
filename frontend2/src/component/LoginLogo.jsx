import { TiPlus } from 'react-icons/ti';
import SignInLogo from '../assets/dashboard.png';
import { Link } from 'react-router-dom';

const LoginLogo = () => {
  return (
    <div>
      <div className="h-[10%] w-full    flex justify-center items-center">
        {' '}
        <div className="h-[3rem] w-[3rem] bg-logoColor flex justify-center items-center  rounded-2xl">
          <TiPlus color="white" size={30} />
        </div>
      </div>
      <div className=" w-[100%] mt-[5%] sm:mt-[2%] flex justify-center items-center">
        <Link to="/">
          <div className="flex justify-center items-center ">
            <img
              src={SignInLogo}
              alt="panda"
              className="w-[100%] h-[70%] sm:w-[60%] sm:h-[80%]  "
            />
          </div>
        </Link>
      </div>
      <div className="font-sans text-white text-[1.4rem] sm:text-[2.6rem] w-[full]  flex justify-center items-center font-extrabold ">
        Sign in to ProgramPanda
      </div>
      <div className="font-sans text-paraColor text-[0.8rem] sm:text-[1.4rem] w-[full] font-extrabold  flex justify-center items-center">
        Lets get your fitness personalized
      </div>
    </div>
  );
};

export default LoginLogo;
