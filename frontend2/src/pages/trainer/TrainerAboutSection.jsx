import { useState } from 'react';
import { toast } from 'react-toastify';
import SmallSpinner from '../../../SmallSpinner';
import LoginLogo from '../../component/LoginLogo';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TrainerAboutSection = () => {
  const [paragraphs, setParagraphs] = useState(['']);
  const [loading, setLoading] = useState(false);
  const { trainerId } = useParams();
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleParagraphChange = (index, e) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = e.target.value;
    setParagraphs(newParagraphs);
  };

  const addParagraph = () => setParagraphs([...paragraphs, '']);

  const removeParagraph = (index) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleTrainerDetailSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      toast.error('User authentication required.');
      return;
    }

    const formData = new FormData();

    // Append paragraphs to FormData
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim() !== '') {
        formData.append(`paragraphs[${index}]`, paragraph);
      }
    });

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendapi}/api/trainer/about/${user.user._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Trainer details updated successfully');
        navigate('/home');
      } else {
        toast.error('Failed to update trainer details');
        if (response.data.message) {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error updating trainer details:', error);
      toast.error(
        error.response?.data?.message || 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pt-6 min-h-[100vh] bg-gray-900 p-4 overflow-scroll">
      <Link to="/home" className="mb-8">
        <LoginLogo />
      </Link>

      <form
        className="flex flex-col items-center bg-gray-800 mx-auto max-w-md w-full p-8 rounded-lg shadow-lg border border-orange-600"
        onSubmit={handleTrainerDetailSubmit}
      >
        <div className="flex flex-col w-full mb-6">
          <label
            htmlFor="description"
            className="text-white mb-2 font-semibold"
          >
            Description
          </label>
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="flex flex-col mb-4">
              <textarea
                id={`paragraph-${index}`}
                value={paragraph}
                onChange={(e) => handleParagraphChange(index, e)}
                className="w-full text-white bg-gray-700 h-32 rounded-lg p-3 font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder={`Enter paragraph ${index + 1}...`}
              />
              <button
                type="button"
                className="text-red-600 mt-2"
                onClick={() => removeParagraph(index)}
              >
                Remove Paragraph
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full text-orange-600"
            onClick={addParagraph}
          >
            Add Paragraph
          </button>
        </div>

        <div className="flex justify-center items-center mt-6 w-full">
          <button
            type="submit"
            className="w-full h-12 bg-orange-600 text-white rounded-lg font-sans font-bold hover:bg-orange-700 active:bg-orange-800 transition duration-200"
          >
            {!loading ? 'Save Details' : <SmallSpinner />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerAboutSection;
