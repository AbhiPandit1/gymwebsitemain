import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ProgrammeInfo from './ProgrammeInfo';
import TrainerAbout from './TrainerAbout';
import PersonalInfoTrainer from './PersonalInfoTrainer';
import ReviewCard from '../../../component/ReviewCard';
import Footer from '../../../component/Footer';
import useTrainerDetailHook from '../../../../hook/useTrainerDetailHook';

const PersonalTrainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { trainerId } = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const personalId = user?.user?._id; // Ensure user and user._id are defined

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Destructure values from the custom hook
  const { trainer, description, loading, error, userTrainerDetails } =
    useTrainerDetailHook(trainerId);

  const handleEditClick = () => {
    // Navigate to the edit page with the trainerId
    navigate(`/trainer/about/${trainerId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading trainer details.</p>;

  // Check if userTrainerDetails is defined before comparison
  const isOwner = userTrainerDetails?._id === personalId;
  console.log(description?.paragraphs);

  return (
    <>
      <TrainerAbout />
      <div
        style={{
          background:
            'linear-gradient(270deg, #172438 0%, rgba(6, 18, 33, 0.746434) 32.93%, rgba(30, 55, 86, 0.5) 64.94%, #01040B 102.92%)',
        }}
      >
        <ProgrammeInfo
          descriptionImage={description?.image?.url}
          description={description?.paragraphs} // Assuming description is an array of bullet points
          orderPara={1}
          orderImage={2}
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
        <ReviewCard />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default PersonalTrainer;
