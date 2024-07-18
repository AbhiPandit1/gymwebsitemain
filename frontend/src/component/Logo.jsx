import { Link } from 'react-router-dom';

const Logo = ({ backgroundImage }) => {
  return (
    <div>
      <Link to="/">
        <img
          src={backgroundImage}
          alt="panda"
          className="w-[60%] h-[100%]  sm:w-[340px] sm:h-[38px]"
        />
      </Link>
    </div>
  );
};

export default Logo;
