import { useEffect, useState } from 'react';
import ProgrammeInfo from './ProgrammeInfo';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const PersonalInfoTrainer = () => {
  const { user, token } = useSelector((state) => state.user);
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { trainerId } = useParams();
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); // Use navigate for redirection

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

  // Function to handle redirection to the program purchase page
  const handleBuyProgram = () => {
    if (currentProgramme) {
      // Redirect to the specific program's page using its ID
      navigate(`/programme/${currentProgramme._id}`);
    }
  };

  return (
    <div>
      {trainerDatas.length > 0 && (
        <ProgrammeInfo
          description={processedDescription}
          descriptionImage={descriptionImage}
          orderPara={1}
          orderImage={2}
          title="About"
        />
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrev}
          disabled={trainerDatas.length <= 1}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={trainerDatas.length <= 1}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed ml-4"
        >
          Next
        </button>
      </div>

      {/* Buy Program Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleBuyProgram} // Redirect to the program's specific page
          className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
        >
          Buy Program
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoTrainer;
