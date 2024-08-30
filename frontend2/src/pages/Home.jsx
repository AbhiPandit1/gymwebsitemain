import homeGirl from '../assets/homeGirl.jpeg';
import { IoIosArrowRoundForward } from 'react-icons/io';
import Card from '../component/Card';
import ReviewCard from '../component/ReviewCard';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CategoriesCard from '../component/CategoriesCard';
import DescriptionComponent from '../component/DescriptionComponent';
import CreatorHomeComponent from '../component/CreatorHomeComponent';
import Faq from '../component/Faq';
import Header from '../component/Header';
import Footer from '../component/Footer';

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const role = user?.user?.role || 'user';

  return (
    <>
      {/* Starting Section */}
      <div
        className=" relative h-[60vh] sm:h-[100vh] w-[100vw] font-serif flex flex-col  max-w-[100vw] overflow-hidden "
        style={{
          backgroundImage: `url("https://s3-alpha-sig.figma.com/img/04f8/7885/33cfe88c6aeff5201578e141512f3684?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=q9ZVsE4zQb1M8L3gyP9hB9sT8NbglIkgNqJGwGUKSRwx6LOQXCw2jzrvpPnIDcMQHEjjKNPS~uhWoZmd2cin29S9QXWxLsxaG05Pva-NK~3jG1RtfsoLPcI46N8Nhgy1m6iuCE~Do1Hhj3h07RUAPXiPOKiyplfYBco0OYPYBOhkH4XDiACq5c6OOG1cwcfaIMdVuvAnIcUPZy7fyMIdB1Cjz0-lfzA7c-4QvyCeaFGlpdBrju77gblgJzOn5mTSxoMuE2roVOeEXiRML93ZBQmYtD5UaHuRMShojFyoRCSc55EnyLRr8DYLDQ5jCSkLXGGFIicLvDfkPFz71Z0-EQ__")`,
          backgroundPosition: '75% 15%',
          backgroundSize: 'cover', // Ensures the image covers the entire container
          backgroundRepeat: 'no-repeat', // Prevents the image from repeating
          opacity: '90%',
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div>
          {' '}
          <Header />
        </div>
        <div className="relative">
          {/* First Page Section */}
          <div className=" flex flex-col justify-start gap-8 z-200 mt-[20%] sm:mt-[10%] w-full overflow-hidden">
            <div className="text-white flex flex-col justify-start items-start">
              <div className="flex justify-start ml-[4%] text-left font-extrabold text-3xl leading-none tracking-widest sm:text-[5rem] w-full overflow-hidden">
                ACHIEVE MORE
              </div>

              <div className="font-bold text-3xl ml-[4%] sm:text-[5rem] leading-none tracking-widest text-white overflow-hidden">
                THAN JUST{' '}
                <span className="relative inline-block ml-[2%] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 underline underline-offset-8">
                  FITNESS
                </span>
              </div>
            </div>

            <div className="text-paraColor flex flex-col justify-start w-[100%] overflow-hidden">
              <p className="text-[0.8rem] w-[100%] sm:w-[85%] sm:text-[1.5rem] text-wrap ml-[4%]">
                Decades of fitness experience at your fingertips.
              </p>
              <p className="text-[0.8rem] sm:text-[1.5rem] ml-[4%]">
                labore autem tempora libero consequuntur Lorem ipsum?
              </p>
            </div>
            <div className="text-white flex items-start justify-start sm:ml-[4%] ml-[2%] overflow-hidden w-full mt-1 sm:mt-8">
              <Link
                to={
                  role === 'user'
                    ? '/user/programmes'
                    : `/trainer/programmes/${user.user._id}`
                }
              >
                <button className="w-[12rem] sm:w-[18rem] h-[3rem] sm:h-[4rem] bg-orange-600 flex items-center rounded-sm">
                  <span className="m-2 text-[0.8rem] sm:text-[1.5rem]">
                    your own programs
                  </span>
                  <IoIosArrowRoundForward color="white" className="w-14 h-10" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1vh] rounded-3xl bg-blue-800 shadow-2xl border-b border-red-500 shadow-blue-700 opacity-10"></div>

      {/* Moving Cards Section */}
      <div className="flex flex-col p-5 mb-[5%] bg-gray-950">
        <div className="h-full w-full ml-4  ">
          <Card title="Top Programs" backgroundColor="primary" />
        </div>
        <div className="flex justify-center items-center">
          <button className="justify-center w-[8rem] sm:w-[10rem] h-[3rem] sm:h-[4rem] bg-orange-600 hover:bg-orange-800 flex items-center rounded-sm">
            <span className="m-2 text-[1rem] sm:text-[2rem] text-white">
              More
            </span>
            <IoIosArrowRoundForward color="white" className="w-14 h-10" />
          </button>
        </div>
      </div>

      <div className="relative bg-gray-900">
        <CategoriesCard />
        <div className="absolute inset-x-0 bottom-0 h-[8rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      <div className="relative bg-gray-900">
        <CreatorHomeComponent />
        <div className="absolute inset-x-0 bottom-0 h-[8rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      <div
        style={{
          background:
            'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
        }}
      >
        <DescriptionComponent />
      </div>

      <div className="bg-tertiary p-10">
        <Faq />
        <div className="absolute inset-x-0 bottom-0 h-[8rem] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* Review Card Section */}
      <div
        style={{
          background:
            'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
        }}
      >
        <ReviewCard />
      </div>
      <div
        className="relative"
        style={{
          backgroundColor: '#18171A',
        }}
      >
        <Footer />
      </div>
    </>
  );
};

export default Home;
