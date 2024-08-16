import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillLinkedin,
} from 'react-icons/ai';

const backendapi = import.meta.env.VITE_BACKEND_URL;

const TrainerCardMobile = () => {
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [displayedTrainers, setDisplayedTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [displayCount, setDisplayCount] = useState(3);

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

  const loadMore = () => {
    if (displayCount < trainerDatas.length) {
      const newDisplayCount = Math.min(displayCount + 3, trainerDatas.length);
      setDisplayedTrainers(trainerDatas.slice(0, newDisplayCount));
      setDisplayCount(newDisplayCount);
      if (newDisplayCount >= trainerDatas.length) {
        setHasMore(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {displayedTrainers.map((data) => (
        <div
          key={data._id}
          className="rounded-xl m-auto h-[40vh] w-[70vw] sm:h-[40vh] sm:w-[20vw] overflow-hidden bg-primary relative"
        >
          <div className="absolute inset-0 bg-primary">
            <img
              src={data.user.profilePhoto.url}
              alt={data.user.name}
              className="object-cover w-full h-full transition-opacity duration-500 ease-in-out opacity-100"
            />
          </div>
          <div className="absolute top-5 left-5 flex gap-4 bg-secondary rounded-xl p-2">
            {data.socialMediaLink.instagram && (
              <a
                href={data.socialMediaLink.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillInstagram size={40} color="white" />
              </a>
            )}
            {data.socialMediaLink.linkedin && (
              <a
                href={data.socialMediaLink.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillLinkedin size={40} color="white" />
              </a>
            )}
            {data.socialMediaLink.facebook && (
              <a
                href={data.socialMediaLink.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillFacebook size={40} color="white" />
              </a>
            )}
          </div>
          <div className="mt-[1rem] font-extrabold text-2xl font-sans text-white absolute bottom-5 left-5">
            {data.user.name}
            <div className="font-extrabold text-1xl font-sans text-paraColor mt-2">
              Creator
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4">
        {hasMore ? (
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-secondary text-white rounded-lg"
          >
            Load More
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-2 bg-primary text-white rounded-lg cursor-not-allowed"
          >
            No More Creators
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainerCardMobile;
