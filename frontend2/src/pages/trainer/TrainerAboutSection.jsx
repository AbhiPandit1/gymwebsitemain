import { FaUser, FaPlus, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-toastify';
import SmallSpinner from '../../../SmallSpinner';
import LoginLogo from '../../component/LoginLogo';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TrainerAboutSection = () => {
  const [paragraphs, setParagraphs] = useState(['']);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(false);
  const { trainerId } = useParams();
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const { user } = useSelector((state) => state.user);

  const handleParagraphChange = (index, e) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = e.target.value;
    setParagraphs(newParagraphs);
  };

  const addParagraph = () => setParagraphs([...paragraphs, '']);

  const removeParagraph = (index) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    } else {
      setImage(null);
      setImageName('');
    }
  };

  const handleTrainerDetailSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      toast.error('User authentication required.');
      return;
    }

    // Create a FormData object to handle the multipart/form-data
    const formData = new FormData();

    // Append paragraphs to FormData
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim() !== '') {
        formData.append(`paragraphs[${index}]`, paragraph);
      }
    });

    // Append the image to FormData
    if (image) {
      formData.append('aboutImage', image);
    }

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
    <div className="flex flex-col justify-center items-center pt-6 min-h-screen bg-gray-900 p-4">
      <Link to="/home" className="mb-8">
        <LoginLogo />
      </Link>

      <form
        className="flex flex-col items-center bg-gray-800 mx-auto max-w-md w-full p-8 rounded-lg shadow-lg border border-orange-600"
        onSubmit={handleTrainerDetailSubmit}
      >
        <div className="flex flex-col items-center mb-6">
          <label className="bg-orange-600 border-b border-dotted border-gray-500 w-full max-w-xs h-24 flex flex-col justify-center items-center cursor-pointer rounded-2xl p-3 relative transition-all duration-200 hover:bg-orange-700">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            {imageName ? (
              <div className="flex items-center gap-2">
                <h1 className="text-white font-sans truncate">{imageName}</h1>
                <button
                  type="button"
                  className="text-white"
                  onClick={() => {
                    setImage(null);
                    setImageName('');
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <FaPlus size={40} color="white" />
                <h1 className="text-white font-sans mt-2">Upload Image</h1>
              </>
            )}
          </label>
          <p className="mt-3 text-white font-sans text-lg font-semibold">
            Upload Trainer Image
          </p>
          <p className="text-gray-400 font-sans text-sm">
            Please upload a high-quality image.
          </p>
        </div>

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
