import homeGirl from '../assets/homeGirl.jpeg';
import { IoIosArrowRoundForward } from 'react-icons/io';
import Card from '../component/Card';
import ReviewCard from '../component/ReviewCard';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  {
    /*http://localhost:5173/ */
  }

  const { user } = useSelector((state) => state.user);
  const role = user.user.role;

  return (
    <>
      {/*Starting Section */}
      <div className="bg-primary h-[100vh] w-[100vw]  p-5 flex flex-col mb-1  ">
        <div className="relative">
          <img
            src={homeGirl}
            alt="homeGirl"
            className="h-[100vh] w-[100%] object-center object-cover  transform scale-100  "
          />

          {/*First Page Section*/}
          <div className="absolute flex flex-col justify-center  z-200 top-[30%] w-full bg-red  ">
            <div className="text-white flex flex-col justify-center items-center">
              <div className=" flex justify-center    font-extrabold font-sans text-3xl  leading-none tracking-tighter sm:text-[6rem] sm:leading-none sm:tracking-normal w-full ">
                ACHIEVE MORE
              </div>

              <div className="flex justify-center   items-center   font-bold font-sans text-4xl leading-none tracking-tighter sm:text-[6rem] sm:leading-none sm:tracking-normal text-white   ">
                THAN JUST FITNESS
              </div>
            </div>

            <div className="text-paraColor flex flex-col   w-full  ">
              <p className="text-center font-sans text-[1rem] w-[95%] sm:text-[1.6rem] text-wrap">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
                Lorem ipsum dolor sit.
              </p>
              <p className="text-center font-sans text-[1rem] sm:text-[1.5rem]">
                labore autem tempora libero consequuntur Lorem ipsum .?
              </p>
            </div>
            <div className="text-white  flex items-start justify-center     w-full mt-8">
              <Link
                to={
                  role === 'user'
                    ? '/user/programmes'
                    : `trainer/programmes/${user.user._id}`
                }
              >
                <button className="w-[17rem] sm:w-[18rem] h-[4rem] bg-secondary flex items-center ml-4 mr-2 rounded-l-[1rem] rounded-r-[1rem]">
                  <span className="ml-4 font-sans">your own programme</span>
                  <IoIosArrowRoundForward color="white" className="w-14 h-10" />
                </button>
              </Link>
            </div>

            <div className="text-white flex justify-center items-start w-full  sm:w-full  mt-4 ">
              <input
                type="text"
                placeholder="search..."
                className="w-[90%] sm:w-[35rem] h-[4rem] font-sans rounded-l-[1rem] rounded-r-[1rem] p-4 bg-tertiary border-secondary border-[1px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/*Moving Cards Section */}
      <div className="flex flex-col p-5 ">
        <div className="h-full w-full mt-4">
          <Card title="Top Programs" backgroundColor="boxColor" />
        </div>
        <div className="bg-boxColor h-full rounded-[32px]">
          {/* Removed m-[3%] class from here */}
          <Card title="Trending" backgroundColor="primary" />
        </div>
        <div className="bg-primary h-full">
          <Card
            title="Our Picks"
            backgroundColor="boxColor"
            buttonTrue="true"
          />
        </div>
      </div>

      {/*Review Card Section */}
      <div className="bg-primary">
        <ReviewCard />
      </div>
    </>
  );
};

export default Home;
