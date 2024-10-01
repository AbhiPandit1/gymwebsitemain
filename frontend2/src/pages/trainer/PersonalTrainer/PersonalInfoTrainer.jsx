import { useEffect, useState } from 'react';
import ProgrammeInfo from './ProgrammeInfo';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { PiArrowCircleLeftFill, PiArrowCircleRightFill } from 'react-icons/pi';
import ProgrammeDetail from '../../user/ProgrammeDetail'; // Ensure correct path

const PersonalInfoTrainer = () => {
  const { user, token } = useSelector((state) => state.user);
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false); // State to manage ProgrammeDetail visibility
  const [selectedProgramme, setSelectedProgramme] = useState(null); // State to hold the selected programme
  const { trainerId } = useParams();
  const backendapi = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getPersonalProgramme = async () => {
      try {
        const response = await axios.get(
          `${backendapi}/api/admin/trainer/programme/${trainerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrainerDatas(response.data.programmes);
        console.log(response.data.programmes);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || 'Add a programme');
      }
    };

    getPersonalProgramme();
  }, [trainerId, token]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : trainerDatas.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < trainerDatas.length - 1 ? prevIndex + 1 : 0
    );
  };

  const closeModal = () => {
    console.log('Closing modal');
    setShowDetail(false);
  };

  const handleBuyProgram = () => {
    if (trainerDatas.length > 0) {
      const programme = trainerDatas[currentIndex];
      setSelectedProgramme(programme);
      setShowDetail(true); // Show ProgrammeDetail component
    }
  };

  const currentProgramme = trainerDatas[currentIndex];
  const descriptionArray = currentProgramme ? currentProgramme.desc : [];
  const descriptionImage = currentProgramme?.categoryPhoto?.url || '';

  const processedDescription = `
    <ul>
      ${descriptionArray
        .map((text) => {
          return text
            .split('.')
            .filter(Boolean)
            .map((sentence) => `<li>${sentence.trim()}.</li>`)
            .join('');
        })
        .join('')}
    </ul>
  `;

  return (
    <div
      className="relative"
      style={{
        background:
          'linear-gradient(180deg, #050c1e 0%, #050c1e 40%, #050c1e 70%, #050c1e 100%)',
      }}
    >
      {trainerDatas.length > 0 && (
        <ProgrammeInfo
          description={processedDescription}
          descriptionImage={descriptionImage}
          orderPara={2}
          orderImage={1}
          title="About"
          topHeading="Programs"
        />
      )}
      <div className="flex justify-center mt-4 absolute right-[1rem] sm:right[5.2rem] bottom-[5.8rem]">
        <button
          onClick={handlePrev}
          disabled={trainerDatas.length <= 1}
          className="text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PiArrowCircleLeftFill size={40} color="orange" />
        </button>
        <button
          onClick={handleNext}
          disabled={trainerDatas.length <= 1}
          className="text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PiArrowCircleRightFill size={40} color="orange" />
        </button>
      </div>

      {/* Buy Program Button */}
      <div className="flex justify-center">
        <button
          onClick={handleBuyProgram}
          className="bg-orange-500 text-white py-4 px-10 shadow-lg hover:bg-orange-600 transition duration-300"
        >
          Buy Program
        </button>
      </div>

      {/* Conditionally render ProgrammeDetail */}
      {showDetail && selectedProgramme && (
        <ProgrammeDetail
          programmeId={selectedProgramme._id}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default PersonalInfoTrainer;
