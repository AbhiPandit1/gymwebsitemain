import { useEffect, useState } from 'react';
import ProgrammeInfo from './ProgrammeInfo';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Make sure you have react-toastify installed
import { useParams } from 'react-router-dom';

const PersonalInfoTrainer = () => {
  const { user, token } = useSelector((state) => state.user);
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
        toast.error(error.response?.data?.error || 'Something went wrong');
      }
    };

    getPersonalProgramme();
  }, [trainerId, token]);

  // Function to go to the previous programme
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : trainerDatas.length - 1
    );
  };

  // Function to go to the next programme
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < trainerDatas.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Extract description and profile image from current programme
  const currentProgramme = trainerDatas[currentIndex];
  const descriptionArray = currentProgramme ? currentProgramme.desc : [];
  const descriptionImage = currentProgramme?.categoryPhoto?.url || '';

  // Process description to handle newlines and format it properly with bullet points
  const processedDescription = `
    <ul>
      ${descriptionArray
        .map((text) => {
          // Split text by full stops and wrap each sentence in <li> tags
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
    <div>
      {trainerDatas.length > 0 && (
        <ProgrammeInfo
          description={processedDescription} // Pass formatted description
          descriptionImage={descriptionImage}
          orderPara={1} // Adjust as needed
          orderImage={2} // Adjust as needed
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
    </div>
  );
};

export default PersonalInfoTrainer;
