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
  const [hasMore, setHasMore] = useState(true);
  const [displayCount, setDisplayCount] = useState(3);
  const [showLoadMore, setShowLoadMore] = useState(true);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await axios.get(`${backendapi}/api/trainer`);
        setTrainerDatas(response.data.trainers);
        setDisplayedTrainers(response.data.trainers.slice(0, displayCount));
        if (response.data.trainers.length <= displayCount) {
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
  }, [displayCount]);

  useEffect(() => {
    // Filter trainers based on search query
    const filteredTrainers = trainerDatas.filter((trainer) =>
      trainer?.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedTrainers(filteredTrainers.slice(0, displayCount));
    if (filteredTrainers.length <= displayCount) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [searchQuery, trainerDatas, displayCount]);

  const loadMore = () => {
    setDisplayedTrainers(trainerDatas); // Show all trainers
    setDisplayCount(trainerDatas.length); // Update displayCount to the total number
    setShowLoadMore(false); // Hide "Load More" button
    setHasMore(false); // No more trainers to load
  };

  const loadLess = () => {
    const initialDisplayCount = 3;
    setDisplayedTrainers(trainerDatas.slice(0, initialDisplayCount));
    setDisplayCount(initialDisplayCount);
    setShowLoadMore(true); // Show "Load More" button
    setHasMore(true); // Enable "Load More" if more trainers exist
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

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {displayedTrainers?.map((data) => (
        <div
          key={data._id} // Use the unique _id for the key
          className="relative max-h-[400px] min-h-[400px] min-w-[80vw] rounded-xl overflow-hidden bg-transparent border border-orange-600 hover:shadow-2xl hover:shadow-orange-600"
        >
          <img
            src={data?.user?.profilePhoto?.url}
            alt={data?.user?.name}
            className="w-full h-[80%] object-cover transition-opacity duration-500 ease-in-out opacity-100"
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
            <div className="font-extrabold text-md text-gray-400">Creator</div>
          </div>
        </div>
      ))}
      <div className="flex justify-center  mt-4 space-x-4">
        {showLoadMore && (
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-orange-600 text-center flex justify-center items-center text-white rounded-lg"
          >
            Load More
          </button>
        )}
        {!showLoadMore && (
          <button
            onClick={loadLess}
            className="px-4 py-2 bg-secondary text-white rounded-lg"
          >
            Load Less
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainerCardMobile;
