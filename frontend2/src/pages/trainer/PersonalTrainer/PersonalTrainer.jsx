import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ProgrammeInfo from './ProgrammeInfo';
import TrainerAbout from './TrainerAbout';
import PersonalInfoTrainer from './PersonalInfoTrainer';
import ReviewCard from '../../../component/ReviewCard';
import Footer from '../../../component/Footer';
import useTrainerDetailHook from '../../../../hook/useTrainerDetailHook';
import TrainerProfileSkeleton from '../../skeletons/TrainerProfileSkeleton';
import TrainerReviewCard from '../../../component/TrainerReviewCard';

const PersonalTrainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { trainerId } = useParams();
  const { user } = useSelector((state) => state?.user);
  const { tarinerId } = useParams();
  const navigate = useNavigate();

  const personalId = user?.user?._id;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Destructure values from the custom hook
  const { trainer, description, loading, error, userTrainerDetails } =
    useTrainerDetailHook(trainerId);
  console.log(trainer);

  const handleEditClick = () => {
    // Navigate to the edit page with the trainerId
    navigate(`/trainer/about/${trainerId}`);
  };

  // Check if userTrainerDetails is defined before comparison
  const isOwner = userTrainerDetails?._id === personalId;

  if (loading) return <TrainerProfileSkeleton />; // Show the skeleton while loading
  if (error) return <p>Error loading trainer details.</p>;

  return (
    <>
      <div
        style={{
          background:
            'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
        }}
      >
        <TrainerAbout />
        <div
          style={{
            background:
              'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
          }}
        >
          <ProgrammeInfo
            descriptionImage={userTrainerDetails?.profilePhoto?.url}
            description={description?.paragraphs}
            orderPara={2}
            orderImage={1}
            trainerName={userTrainerDetails?.name}
            topHeading="About"
          />
        </div>
        {isOwner && (
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Edit
          </button>
        )}
        <div className="text-white">
          <PersonalInfoTrainer />
        </div>
        <div>
          <ReviewCard currentUser={user.user} />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default PersonalTrainer;
