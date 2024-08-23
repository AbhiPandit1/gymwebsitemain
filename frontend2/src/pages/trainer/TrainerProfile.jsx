import { useState, useEffect } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import ReviewForm from '../Setting/Component/ReviewForm';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TrainerProfile = () => {
  const dashBoardLink = useDashboardLinks();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [trainerDatas, setTrainerDatas] = useState([]);
  const { id, trainerId } = useParams();
  const { user } = useSelector((state) => state.user);

  const trainer = {
    name: 'John Doe',
    imageUrl:
      'https://res.cloudinary.com/dzy51cqxa/image/upload/v1720730943/profile_photos/h7kmsyehkdravtvb033h.jpg',
    totalReviews: 120,
  };

  const handleClick = () => {
    setHoverDashboard((prevState) => !prevState);
  };

  useEffect(() => {
    const getProgramme = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/admin/trainer/programme/${trainerId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setTrainerDatas(response.data.programmes);
        console.log(response.data.programmes);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Error fetching programmes'
        );
      }
    };
    getProgramme();
  }, [id, user.token, trainerId]);

  return (
    <div className="grid grid-cols-7 h-screen max-w-full text-white font-sans bg-gray-900">
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'hidden' : 'col-span-7'
        } sm:${hoverDashboard ? 'hidden' : 'col-span-2'}`}
        onClick={handleClick}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard ? 'col-span-7' : 'col-span-7'
        } sm:${hoverDashboard ? 'col-span-7' : 'col-span-5'} overflow-y-auto`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div
            className="absolute left-0 top-16 z-10 animate-shake cursor-pointer hover:animate-none transition-transform duration-300"
            onClick={handleClick}
          >
            <BiSolidRightArrow size={80} color="white" />
          </div>
        )}

        {/* Trainer Information Section */}
        <div className="relative p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg m-4">
          <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
          <div className="relative flex items-center z-10">
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={trainer.imageUrl}
                alt="Trainer"
                className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
            <div className="ml-6">
              <h2 className="text-4xl font-extrabold mb-2">{trainer.name}</h2>
              <p className="text-xl text-gray-300 mb-4">
                {trainer.totalReviews} Reviews
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition duration-200">
                Follow Trainer
              </button>
            </div>
          </div>
        </div>

        {/* Display Trainer Programmes */}
        <div className="mt-8 mx-5">
          <h3 className="text-2xl font-bold mb-4">Trainer's Programmes</h3>
          <ul>
            {trainerDatas.length > 0 ? (
              trainerDatas.map((programme) => (
                <li
                  key={programme._id}
                  className="p-4 mb-4 bg-gray-800 rounded-lg shadow-lg"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={programme.categoryPhoto.url}
                        alt={programme.category.join(', ')}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">
                        {programme.category.join(', ')}
                      </h4>
                      <p>{programme.desc}</p>
                      {programme._id !== id && (
                        <p className="text-sans text-[2rem] font-sans font-extrabold">
                          ${programme.price}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {programme._id !== id ? (
                      <button className="px-4 py-2 bg-secondary text-white rounded-lg shadow hover:bg-green-500 transition duration-200">
                        <Link to={`/programme/${programme._id}`}>Buy</Link>
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-gray-500 transition duration-200">
                        Aready Yours
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-300">No programmes found.</p>
            )}
          </ul>
        </div>

        {/* Conditionally render the ReviewForm */}
        {user && user.user.role === 'user' && (
          <div className="mt-8 mx-5">
            <ReviewForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerProfile;
