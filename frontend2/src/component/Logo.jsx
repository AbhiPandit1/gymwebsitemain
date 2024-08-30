import { Link } from 'react-router-dom';

const Logo = ({ backgroundImage }) => {
  return (
    <div>
      <Link to="/">
        <img
          src={backgroundImage}
          alt="panda"
          className=" sm:w-[190px] sm:h-[40px]"
          style={{ filter: 'brightness(1.5)' }}
        />
      </Link>
    </div>
  );
};

export default Logo;
