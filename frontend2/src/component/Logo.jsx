import { Link } from 'react-router-dom';

const Logo = ({ backgroundImage }) => {
  return (
    <div>
      <Link to="/">
        <img
          src={backgroundImage}
          alt="panda"
          className="w-[100%] h-[100%]  sm:w-[400px] sm:h-[80px]"
        />
      </Link>
    </div>
  );
};

export default Logo;
