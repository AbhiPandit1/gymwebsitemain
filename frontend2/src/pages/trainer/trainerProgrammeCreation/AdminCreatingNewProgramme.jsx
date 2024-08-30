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
  const [planType, setPlanType] = useState('');

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

    const formData = {
      category,
      price,
      categoryPhoto,
      trainerMail,
      title,
      desc,
      planType,
    };

    try {
      setLoadings(true);
      const response = await dispatch(createProgramme(formData, id, token));

      if (response?.status === 201) {
        toast.success(
          response?.data.message || 'Programme created successfully'
        );

        const programmeId = response?.data.programme._id;

        if (planType === 'Day') {
          navigate(
            `/trainer/programme/day/plan/${user.user._id}/${programmeId}`
          );
        } else {
          navigate(
            `/trainer/create/programme/diet/plan/${user.user._id}/${programmeId}`
          );
        }
      }
    } catch (error) {
      toast.error('Error creating programme: ' + error.message);
    } finally {
      setLoadings(false);
    }
    resetForm();
  };
  const resetForm = () => {
    setCategory([]);
    setPrice('');
    setCategoryPhoto(null);
    setCategoryPhotoName('');
    setTrainerMail(user.user.email);
    setTitle('');
    setDesc('');
    setPlanType('');
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

  const handlePlanTypeChange = (e) => {
    setPlanType(e.target.value);
  };

  const dashBoardLink = useDashboardLinks();

  return (
    <div className="grid grid-cols-9 gap-[2rem] h-screen max-w-[100vw bg-gray-900 ">
      <div className="hidden sm:col-span-1 sm:grid bg-gray-900 text-white">
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>

      <div className="col-span-9 sm:col-span-8  bg-gray-900 text-white">
        <div className="h-full">
          <DashboardHeader />

          <h1 className="text-3xl font-extrabold text-center py-4">
            Create Program
          </h1>

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
              <div className="flex flex-wrap gap-2 mb-4">
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
              <div className="flex flex-wrap gap-4 mb-4">
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

              {/* Plan Type Selection */}
              <div className="flex flex-col mb-4">
                <label className="text-white mb-2">Plan Type</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="diet-plan"
                      name="planType"
                      value="Diet"
                      checked={planType === 'Diet'}
                      onChange={handlePlanTypeChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="diet-plan"
                      className="text-white cursor-pointer"
                    >
                      Diet Plan
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="day-plan"
                      name="planType"
                      value="Day"
                      checked={planType === 'Day'}
                      onChange={handlePlanTypeChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="day-plan"
                      className="text-white cursor-pointer"
                    >
                      Day Plan
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="both-plan"
                      name="planType"
                      value="Both"
                      checked={planType === 'Both'}
                      onChange={handlePlanTypeChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="both-plan"
                      className="text-white cursor-pointer"
                    >
                      Both
                    </label>
                  </div>
                </div>
              </div>

              {/* Price, Title, and Trainer Mail */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex flex-col w-full sm:w-[50%]">
                  <label className="text-white mb-2">Price</label>
                  <input
                    type="number"
                    className="w-full h-12 bg-tertiary text-white p-2 rounded-[16px]"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[50%]">
                  <label className="text-white mb-2">Programme Title</label>
                  <input
                    type="text"
                    className="w-full h-12 bg-tertiary text-white p-2 rounded-[16px]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Trainer Email */}
              <div className="mb-4">
                <label className="text-white mb-2">Trainer Email</label>
                <input
                  type="email"
                  className="w-full h-12 bg-tertiary text-white p-2 rounded-[16px]"
                  value={trainerMail}
                  onChange={(e) => setTrainerMail(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="text-white mb-2">Description</label>
                <textarea
                  className="w-full h-32 bg-tertiary text-white p-2 rounded-[16px]"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full h-12 bg-orange-900 text-white rounded-[16px] ${
                  loadings ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loadings}
              >
                {loadings ? 'Creating...' : 'Create Programme'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatingNewProgramme;
