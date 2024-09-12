import { TiPlus } from 'react-icons/ti';
import SignInLogo from '../assets/NewLogo.png';
import { Link } from 'react-router-dom';

const LoginLogo = ({header}) => {
  return (
    <div>
      <div className="h-[10%] w-full    flex justify-center items-center">
        {' '}
      </div>
      <div className=" w-[100%] mt-[5%] sm:mt-[2%] flex justify-center items-center">
        <Link to="/">
          <div className="flex justify-center items-center ">
            <img src={SignInLogo} alt="panda" className="w-[16rem] h-[4rem]  " />
          </div>
        </Link>
      </div>
      <div className="font-sans text-white text-[1.4rem] sm:text-[2.2rem] w-[full] mt-[2rem]  flex justify-center items-center font-extrabold ">
       {header}
      </div>
      <div className="font-sans text-paraColor text-[0.8rem] sm:text-[1.4rem] w-[full] font-extrabold  flex justify-center items-center">
        Lets get your fitness personalized
      </div>
    </div>
  );
};

export default LoginLogo;
