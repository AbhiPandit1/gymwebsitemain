import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProgramme } from '../../../action/programmeActions';
import DashboardComponent from '../../../component/DashboardComponent';
import DashboardHeader from '../../../component/DashboardHeader';
import { useParams, useNavigate } from 'react-router-dom';
import useDashboardLinks from '../../../../hook/CreateDahsboardLinks';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminCreatingNewProgramme = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const token = user.token;

  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState('');
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [categoryPhotoName, setCategoryPhotoName] = useState('');
  const [trainerMail, setTrainerMail] = useState(user.user.email);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loadings, setLoadings] = useState(false);
  console.log(category);

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

  const handleMakeCategories = async (e) => {
    e.preventDefault();

    // Form data preparation
    const formData = {
      category,
      price,
      categoryPhoto,
      trainerMail,
      title,
      desc,
    };
    console.log('FormData:', formData);
    try {
      setLoadings(true);
      const response = await dispatch(createProgramme(formData, id, token));

      // Check response status and provide feedback
      if (response?.status === 201) {
        toast.success(
          response?.data.message || 'Programme created successfully'
        );

        // Reset form fields after successful submission
        resetForm();

        // Navigate to the desired route
        navigate(`/trainer/create/programme/type/${user.user._id}`);
      }
    } catch (error) {
      console.error('Error creating programme:', error);
      toast.error('Error creating programme: ' + error.message);
    } finally {
      setLoadings(false);
    }
  };

  const resetForm = () => {
    setCategory([]);
    setPrice('');
    setCategoryPhoto(null);
    setCategoryPhotoName('');
    setTrainerMail(user.user.email);
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

  return (
    <div className="grid grid-cols-7 h-screen max-w-[100vw]">
      {/* Sidebar */}
      <div className="hidden sm:col-span-2 sm:grid bg-black text-white">
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>

      {/* Main Content */}
      <div className="col-span-7 sm:col-span-5 bg-primary text-white">
        <div className="h-full">
          <DashboardHeader />

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center py-4">
            Create Program
          </h1>

          {/* Form */}
          <div className="h-[80vh] overflow-auto p-6 w-full">
            <form
              className="flex flex-col gap-8"
              onSubmit={handleMakeCategories}
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

              {/* Price, Title, and Trainer Mail */}
              <div className="flex flex-col sm:flex-row justify-around items-center w-full">
                <div className="flex flex-col w-full sm:w-[45%] mb-4 sm:mb-0">
                  <label className="text-white mb-2">Price</label>
                  <input
                    type="number"
                    className="w-full h-12 bg-tertiary text-white p-2 rounded-[16px]"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[45%] mb-4 sm:mb-0">
                  <label className="text-white mb-2">Programme Title</label>
                  <input
                    type="text"
                    className="w-full h-12 bg-tertiary text-white p-2 rounded-[16px]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-around items-center w-full">
                <div className="flex flex-col w-full sm:w-[45%]">
                  <label className="text-white mb-2">Trainer Mail</label>
                  <input
                    type="email"
                    className="w-full h-12 bg-tertiary text-white p-2 rounded-[16px]"
                    placeholder="Enter trainer email"
                    value={trainerMail}
                    onChange={(e) => setTrainerMail(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="text-white mb-2">Description</label>
                <textarea
                  rows={5}
                  className="w-full bg-tertiary text-white p-2 rounded resize-none"
                  placeholder="...desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
                    loadings ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={loadings}
                >
                  {loadings ? 'Creating...' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatingNewProgramme;
