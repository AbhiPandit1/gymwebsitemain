import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillLinkedin,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import TrainerSkeleton from '../pages/skeletons/TrainerSkeleton';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const TrainerCardMobile = ({ searchQuery }) => {
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [displayedTrainers, setDisplayedTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage] = useState(3); // Number of items per page
  const [hasMore, setHasMore] = useState(true); // Track if more pages are available
  const [totalTrainers, setTotalTrainers] = useState(0); // Total number of trainers

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await axios.get(`${backendapi}/api/trainer`);
        setTrainerDatas(response.data.trainers);
        setTotalTrainers(response.data.trainers.length);
        // Update displayed trainers based on the current page and items per page
        setDisplayedTrainers(response.data.trainers.slice(0, itemsPerPage));
        if (response.data.trainers.length <= itemsPerPage) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError('Failed to fetch trainer data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [itemsPerPage]);

  useEffect(() => {
    // Filter trainers based on search query
    const filteredTrainers = trainerDatas.filter((trainer) =>
      trainer?.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setDisplayedTrainers(filteredTrainers.slice(startIndex, endIndex));
    setHasMore(filteredTrainers.length > endIndex);
  }, [searchQuery, trainerDatas, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(totalTrainers / itemsPerPage);
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === i
              ? 'bg-gradient-to-r from-orange-400 to-orange-600  text-white'
              : 'bg-gray-300 text-black'
          } hover:bg-orange-700`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <div>
        <TrainerSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalPages = Math.ceil(totalTrainers / itemsPerPage);

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {displayedTrainers?.map((data) => (
        <div
          key={data._id} // Use the unique _id for the key
          className="relative max-h-[400px] min-h-[450px] min-w-[70vw] rounded-xl overflow-hidden bg-transparent border border-orange-600 hover:shadow-2xl hover:shadow-orange-600"
        >
          <img
            src={data?.user?.profilePhoto?.url}
            alt={data?.user?.name}
            className="w-full h-[100%] object-cover transition-opacity duration-500 ease-in-out opacity-100"
          />
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
              className="text-white bg-orange-600 py-1 px-2 rounded-lg hover:bg-orange-800 transition duration-300"
            >
              Know More
            </Link>
          </div>
          <div className="absolute bottom-24 left-4 right-4 text-white">
            <div className="font-extrabold text-xl">{data?.user?.name}</div>
            <div className="font-extrabold text-md text-white">Creator</div>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4 space-x-4">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600  text-center flex justify-center items-center text-white rounded-lg"
          >
            Previous
          </button>
        )}
        {renderPageNumbers()}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600  text-center flex justify-center items-center text-white rounded-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainerCardMobile;
