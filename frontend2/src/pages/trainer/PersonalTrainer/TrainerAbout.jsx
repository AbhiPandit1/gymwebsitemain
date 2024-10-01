import React from 'react';
import { FaCheckCircle, FaCheckSquare } from 'react-icons/fa'; // Import the icons
import Header from '../../../component/Header';
import { useParams } from 'react-router-dom';
import useTrainerDetailHook from '../../../../hook/useTrainerDetailHook';
import { useSelector } from 'react-redux';
import { BsArrowRight } from 'react-icons/bs';

const TrainerAbout = () => {
  const { trainerId } = useParams();
  const { user } = useSelector((state) => state.user);

  console.log(user.user.gender);
  const { trainer, description, loading, error, userTrainerDetails } =
    useTrainerDetailHook(trainerId);

  console.log(user.user.role);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading trainer details.</p>;

  return (
    <>
      {/* Header */}
      <div
        className="relative z-10"
        style={{
          backgroundImage:
            user.user.gender === 'male'
              ? `url('https://res.cloudinary.com/diohupopk/image/upload/v1727720104/profile_photos/zjuarlhlnzd8jaxmy7mx.png')`
              : `url('https://res.cloudinary.com/diohupopk/image/upload/v1727544314/profile_photos/csyacnjklkjpcmzevcqh.png')`,
          backgroundSize: 'cover', // Ensures the image covers the entire container
          backgroundPosition: 'center', // Centers the image within the container
          backgroundRepeat: 'no-repeat',
          backgroundPositionY: '30%',
        }}
      >
        <Header />

        {/* Hero Section */}
        <div className="relative h-[50vh] sm:h-screen w-full flex items-center justify-start text-white bg-cover bg-center">
          {/* Semi-transparent overlay for better text readability */}
          <div className="absolute inset-0 bg-opacity-60"></div>

          {/* Container for text content */}
          <div className="relative z-10 p-8 sm:p-16 text-center">
            <h1 className="text-transparent  text-4xl sm:text-6xl md:text-7xl text-white font-extrabold font-sans">
              {userTrainerDetails ? userTrainerDetails?.name : 'Loading...'}
            </h1>

            {/* Tagline */}
            <h2 className="text-orange-400 text-xl sm:text-2xl md:text-3xl mt-4">
              {description ? description.tagline : 'Loading...'}
            </h2>

            {/* Pricing Information */}
            <div className="text-white text-lg sm:text-xl mt-6 flex flex-col justify-center items-center space-x-4">
              <button className="bg-orange-500 flex gap-1 text-white py-4 px-6  shadow-lg hover:bg-orange-600 transition duration-300">
                Train Yourself now
                <BsArrowRight size={30} />
              </button>

              <p className="flex items-center text-white text-lg">
                ProgrammePanda Guaranteed
                <FaCheckCircle className="text-green-400 text-2xl" />
              </p>
            </div>
          </div>
        </div>

        {/* ProgrammePanda Guaranteed Section at the Bottom */}
      </div>

      {/* Section for additional information */}
    </>
  );
};

export default TrainerAbout;
