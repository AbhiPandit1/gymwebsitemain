import { useState, useEffect } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../component/Card';
import ReviewCard from '../component/ReviewCard';
import CreatorHomeComponent from '../component/CreatorHomeComponent';
import Faq from '../component/Faq';
import Header from '../component/Header';
import Footer from '../component/Footer';
import HomeSkeleton from './skeletons/HomeSkeleton';

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
        className="relative w-full flex flex-col max-w-full  "
        style={{
          background:
            'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
        }}
      >
        <Header />
        <div className="relative">
          {/* First Page Section */}
          <div className="flex flex-col justify-center items-center gap-6 w-full px-4 sm:px-6 overflow-hidden">
            {/* Headings */}
            <div className="text-white flex flex-col justify-start items-start">
              <p className="flex justify-start text-left text-[1.8rem] sm:text-[2rem] lg:text-[3rem] tracking-wide w-full font-bebes">
                YOUR
                <span className="relative ml-2 bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-transparent underline underline-offset-8">
                  FITNESS LIBRARY
                </span>
              </p>
            </div>

            {/* Subtext */}
          </div>
        </div>

        {/* Moving Cards Section */}
        <div className="flex flex-col font-bebes ">
          <div className="h-full w-full ">
            <Card title="Featured Programs" backgroundColor="transparent" />
          </div>
          <Link to="/programmes">
            <div className="flex justify-center items-center my-4">
              <div className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 hover:bg-orange-500  text-white rounded-full flex items-center">
                View All Programs
                <IoIosArrowRoundForward color="white" className="w-10 h-6" />
              </div>
            </div>
          </Link>
        </div>

        <div className="relative mt-8">
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

        <div className="p-10">
          <Faq />
        </div>

        {/* Review Card Section */}
        <div>
          <ReviewCard currentUser={user?.user} />
        </div>
        <div className="relative">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
