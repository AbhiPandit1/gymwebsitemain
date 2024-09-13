import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineUser,
} from 'react-icons/ai'; // Import an icon for fallback
import { Link } from 'react-router-dom';
import TrainerSkeleton from '../pages/skeletons/TrainerSkeleton';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const TrainerCard = ({ searchQuery }) => {
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [displayedTrainers, setDisplayedTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 3; // Number of trainers per page

  useEffect(() => {
    // Fetch trainer data from the backend API
    const fetchTrainerData = async () => {
      try {
        const response = await axios.get(`${backendapi}/api/trainer`);
        setTrainerDatas(response.data.trainers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError('Failed to fetch trainer data');
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  useEffect(() => {
    // Filter trainers based on search query
    const filteredTrainers = trainerDatas.filter((trainer) =>
      trainer?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastTrainer = currentPage * trainersPerPage;
    const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
    const currentTrainers = filteredTrainers.slice(
      indexOfFirstTrainer,
      indexOfLastTrainer
    );

    setDisplayedTrainers(currentTrainers);
  }, [searchQuery, trainerDatas, currentPage]);

  const totalPages = Math.ceil(
    trainerDatas.filter((trainer) =>
      trainer?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / trainersPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <TrainerSkeleton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[5rem] mt-4">
        {displayedTrainers.map((data) => (
          <div
            key={data._id} // Use the unique _id for the key
            className="relative max-h-[400px] max-w-[20vw] min-h-[500px] rounded-xl overflow-hidden bg-transparent border border-orange-600 hover:shadow-2xl hover:shadow-orange-600"
          >
            {data?.user?.profilePhoto?.url ? (
              <img
                src={data?.user?.profilePhoto?.url} // Use profilePhoto.url for the image source
                alt={data?.user?.name} // Alt text should be descriptive
                className="w-full h-[100%] object-cover transition-opacity duration-500 ease-in-out opacity-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <AiOutlineUser size={50} color="gray" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-t from-black via-transparent to-transparent">
              <div className="flex items-center space-x-2">
                {data?.socialMediaLink?.instagram && (
                  <a
                    href={data?.socialMediaLink?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillInstagram
                      size={30}
                      color="white"
                      className="hover:bg-orange-600"
                    />
                  </a>
                )}
                {data?.socialMediaLink?.linkedin && (
                  <a
                    href={data?.socialMediaLink?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillLinkedin
                      size={30}
                      color="white"
                      className="hover:bg-orange-600"
                    />
                  </a>
                )}
                {data?.socialMediaLink?.facebook && (
                  <a
                    href={data?.socialMediaLink?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AiFillFacebook
                      size={30}
                      color="white"
                      className="hover:bg-orange-600"
                    />
                  </a>
                )}
              </div>
              <Link
                to={`/trainer/${data?.user?._id}`}
                className="text-white bg-orange-600 py-1 px-4 rounded-lg hover:bg-orange-800 transition duration-300"
              >
                Know More
              </Link>
            </div>
            <div className="absolute bottom-24 left-4 right-4 text-white">
              <div className="font-extrabold text-xl">{data?.user?.name}</div>
              <div className="font-extrabold text-md text-gray-white">
                Creator
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-200 text-black disabled:bg-gray-300"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-200 text-black disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TrainerCard;
