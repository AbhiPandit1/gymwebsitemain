import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import homeGirl from '../../assets/homeGirl.jpeg';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';

const UserDashboard = () => {
  {
    /*"/user/dashboard/:id" */
  }
  const { user } = useSelector((state) => state.user);

  const dashBoardLink = useDashboardLinks();
  return (
    <div className="grid grid-cols-7 min-h-[100vh] max-h-[100vh] overflow-hidden text-white">
      <div className="col-span-2 hidden sm:grid">
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>
      <div className="col-span-5">
        <DashboardHeader />
        <div className="p-2">
          <div className="bg-primary h-full w-[100vw] sm:w-full flex flex-col mb-1">
            <div className="relative">
              <img
                src={homeGirl}
                alt="homeGirl"
                className="h-[100vh] sm:w-full object-center object-cover transform scale-100"
              />

              {/* First Page Section */}
              <div className="absolute flex flex-col justify-center top-[30%] w-full">
                <div className="text-white flex flex-col justify-center items-center">
                  <div className="flex justify-center m-auto font-extrabold font-sans text-3xl leading-none tracking-tighter sm:text-[2rem] md:text-[4rem] sm:leading-none sm:tracking-normal w-full">
                    ACHIEVE MORE
                  </div>

                  <div className="flex justify-center mx-auto w-full items-center font-bold font-sans text-4xl leading-none tracking-tighter md:text-[4rem] sm:text-[2rem] sm:leading-none sm:tracking-normal text-white">
                    THAN JUST FITNESS
                  </div>
                </div>

                <div className="text-white flex items-start justify-center w-full mt-8">
                  <Link
                    to={
                      user.hasTakenProgramme
                        ? '/user/programmes'
                        : `/user/programmes`
                    } // Adjusted the structure to correct syntax
                    className="text-white-500 hover:text-gray-300 focus:outline-none"
                  >
                    <button
                      className={`w-[17rem] sm:[18rem] h-[4rem] bg-secondary flex justify-between items-center ml-4 mr-2 pr-4 rounded-l-[1rem] rounded-r-[1rem]`}
                    >
                      <span className={`ml-4 font-sans text-xl `}>
                        {user.hasTakenProgramme
                          ? 'Make your own programme'
                          : 'Your Programme'}
                      </span>
                      <IoIosArrowRoundForward
                        color="white"
                        className="w-14 h-10"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
