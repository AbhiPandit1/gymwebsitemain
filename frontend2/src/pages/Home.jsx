import { useState, useEffect } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import homeGirl from '../assets/homeGirl.jpeg';
import Card from '../component/Card';
import ReviewCard from '../component/ReviewCard';
import CategoriesCard from '../component/CategoriesCard';
import DescriptionComponent from '../component/DescriptionComponent';
import CreatorHomeComponent from '../component/CreatorHomeComponent';
import Faq from '../component/Faq';
import Header from '../component/Header';
import Footer from '../component/Footer';
import HomeSkeleton from './skeletons/HomeSkeleton';
import { FaAngleDoubleDown } from 'react-icons/fa';

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const role = user?.user?.role || 'user';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 200); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      {/* Starting Section */}
      <div
        className="relative w-full flex flex-col max-w-full  bg-gray-950 "
        style={{
          background:
            'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
        }}
      >
        <Header />
        <div className="relative">
          {/* First Page Section */}
          <div className="flex flex-col justify-center items-center gap-6 z-200  w-full px-4 sm:px-6 overflow-hidden">
            {/* Headings */}
            <div className="text-white flex flex-col justify-start items-start">
              <div className="flex justify-start text-left text-[2rem] sm:text-[2rem] lg:text-[3rem] tracking-wide w-full font-bebes">
                YOUR
                <span className="relative ml-2 bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-transparent underline underline-offset-8">
                  FITNESS LIBRARY
                </span>
              </div>
            </div>

            {/* Subtext */}
            <div className="flex justify-center items-center ">
              <p className="text-[1rem]  sm:text-[1.2rem] lg:text-[1.5rem] leading-tight sm:w-[100%] font-Arial text-gray-300">
                Decades of fitness experience at your fingertips.
              </p>

              {/* Button Section */}
            </div>
          </div>
        </div>

        {/* Moving Cards Section */}
        <div className="flex flex-col p-5 font-bebes ">
          <div className="h-full w-full ml-4">
            <Card title="Featured Programs" backgroundColor="transparent" />
          </div>
          <Link to="/programmes">
            <div className="flex justify-center items-center">
              <div className="justify-center w-[8rem] sm:w-[8rem] h-[2rem] sm:h-[3rem] bg-orange-600 rounded-xl hover:bg-orange-800 flex items-center">
                <span className="m-2 text-[1rem] sm:text-[1rem] text-white">
                  More
                </span>

                <IoIosArrowRoundForward color="white" className="w-10 h-6" />
              </div>
            </div>
          </Link>
        </div>

        <div
          className="relative "
          style={{
            background:
              'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
          }}
        >
          <CategoriesCard />
        </div>

        <div
          className="relative"
          style={{
            background:
              'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
          }}
        >
          <CreatorHomeComponent />
        </div>

        {/*  <div
        style={{
          background:
            'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
        }}
      >
        <DescriptionComponent />
      </div>*/}

        <div
          className="p-10"
          style={{
            background:
              'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
          }}
        >
          <Faq />
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
        <div className="relative">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
