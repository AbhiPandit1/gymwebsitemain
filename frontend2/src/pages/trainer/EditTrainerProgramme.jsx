import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { FaPlus, FaTimes } from 'react-icons/fa';
import { BiSolidRightArrow } from 'react-icons/bi';
import { toast } from 'react-toastify';

import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
// Make sure this is the correct hook
import { updateProgramme } from '../../action/programmeActions';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';

const EditTrainerProgramme = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const token = user?.token;
  const { programme } = useSelector((state) => state.programme);

  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState('');
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [categoryPhotoName, setCategoryPhotoName] = useState('');
  const [trainerMail, setTrainerMail] = useState(user?.user?.email || '');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoverDashboard, setHoverDashboard] = useState(false); // Added hover state management

  const categoryOptions = [
    'Nutrition',
    'Bodybuilding',
    'Sports',
    'Women',
    'WeightLoss',
    'PowerLifting',
    'General',
    'Recovery',
  ];

  useEffect(() => {
    if (programme && programme.programme) {
      const prog = programme.programme.find((p) => p._id === id);
      if (prog) {
        setCategory(prog.category || []);
        setPrice(prog.price || '');
        setCategoryPhotoName(prog.categoryPhoto?.url || '');
        setTrainerMail(prog.trainerMail || '');
        setTitle(prog.title || '');
        setDesc(prog.desc || '');
      }
    }
  }, [programme, id]);

  const handleUpdateProgramme = async (e) => {
    e.preventDefault();

    if (category.length === 0) {
      toast.error('Please select at least one category.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('category', JSON.stringify(category));
      formData.append('price', price || '');
      if (categoryPhoto) formData.append('categoryPhoto', categoryPhoto);
      formData.append('trainerMail', trainerMail || '');
      formData.append('title', title || '');
      formData.append('desc', desc || '');

      const response = await dispatch(updateProgramme(formData, id, token));

      if (response?.status === 200 || response?.status === 201) {
        toast.success('Programme updated successfully');
        navigate(`/trainer/create/programme/type/${user.user._id}`);
      } else {
        toast.error(response?.data?.error || 'Failed to update programme');
      }
    } catch (error) {
      console.error('Error updating programme:', error);
      toast.error(error.response?.data?.error || 'Error updating programme');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategory([]);
    setPrice('');
    setCategoryPhoto(null);
    setCategoryPhotoName('');
    setTrainerMail(user?.user?.email || '');
    setTitle('');
    setDesc('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCategoryPhoto(file);
    setCategoryPhotoName(file ? file.name : '');
  };

  const handleClearFile = () => {
    setCategoryPhoto(null);
    setCategoryPhotoName('');
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategory((prevCategory) =>
      checked
        ? [...prevCategory, value]
        : prevCategory.filter((cat) => cat !== value)
    );
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setCategory((prevCategory) =>
      prevCategory.filter((cat) => cat !== categoryToRemove)
    );
  };

  const dashBoardLink = useDashboardLinks();

  const handleClick = () => setHoverDashboard(!hoverDashboard); // Function to handle hover state toggle

  return (
    <div className="grid grid-cols-9 h-screen max-w-[100vw] text-white font-sans bg-gray-900">
      <div
        className={`transition-transform duration-300 bg-gray-900 ${
          hoverDashboard ? 'hidden sm:hidden' : 'col-span-3 sm:col-span-1'
        }`}
      >
        <DashboardComponent
          dashBoardLink={dashBoardLink}
          hoverDashboard={hoverDashboard}
          setHoverDashboard={setHoverDashboard}
        />
      </div>
      <div
        className={`transition-transform duration-300 ${
          hoverDashboard
            ? 'col-span-9 sm:col-span-9'
            : 'col-span-6 sm:col-span-8'
        } overflow-scroll`}
      >
        <DashboardHeader />
        {hoverDashboard && (
          <div className="absolute left-0 z-10 top-[10%] animate-shake cursor-pointer hover:animate-none transition-transform duration-300">
            <BiSolidRightArrow size={40} color="orange" onClick={handleClick} />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center py-4">
          Edit Programme
        </h1>

        {/* Form */}
        <div className="h-[80vh] overflow-auto p-6 w-full">
          <form
            className="flex flex-col gap-8"
            onSubmit={handleUpdateProgramme}
          >
            {/* Image Upload */}
            <div className="flex justify-center items-center w-full">
              <label className="w-[80%] bg-tertiary text-primary p-10 rounded-[40px] border-b-white border-[4px] border-dotted flex justify-center items-center cursor-pointer relative">
                <div className="flex flex-col items-center">
                  {categoryPhotoName ? (
                    <div className="flex items-center gap-2">
                      <h1 className="text-white font-sans">
                        {categoryPhotoName}
                      </h1>
                      <button
                        type="button"
                        className="text-white"
                        onClick={handleClearFile}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FaPlus size={40} color="white" />
                      <h1 className="text-white font-sans">Upload</h1>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  name="categoryPhoto"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Selected Categories */}
            <div className="flex flex-wrap gap-2">
              {category.map((cat, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    className="ml-2"
                    onClick={() => handleRemoveCategory(cat)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            {/* Category Checkboxes */}
            <div className="flex flex-wrap gap-4">
              {categoryOptions.map((option, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${idx}`}
                    value={option}
                    checked={category.includes(option)}
                    onChange={handleCategoryChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`category-${idx}`}
                    className="text-white cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>

            {/* Price, Title, and Trainer Email */}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="w-full p-2 border-b-2 bg-gray-700 border-gray-600 text-white placeholder-white focus:outline-none"
                placeholder="Trainer's Email"
                value={trainerMail}
                onChange={(e) => setTrainerMail(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-2 border-b-2 bg-gray-700 border-gray-600 text-white placeholder-white focus:outline-none"
                placeholder="Enter Programme Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-2 border-b-2 bg-gray-700 border-gray-600 text-white placeholder-white focus:outline-none"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <textarea
                rows="4"
                className="w-full p-2 border-b-2 bg-gray-700 border-gray-600 text-white placeholder-white focus:outline-none"
                placeholder="Enter Programme Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`p-2 text-white rounded-lg ${
                  loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'
                }`}
              >
                {loading ? 'Updating...' : 'Update Programme'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrainerProgramme;
