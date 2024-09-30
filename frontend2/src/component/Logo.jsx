import { Link } from 'react-router-dom';

const Logo = ({ backgroundImage }) => {
  return (
    <div className='flex justify-center items-center'>
      <Link to="/">
        <img
          src={backgroundImage}
          alt="panda"
          className="w-[140px] h-[34px] sm:w-[190px] sm:h-[40px]"
          style={{ filter: 'brightness(1.5)' }}
        />
      </Link>
    </div>
  );
};

export default Logo;
