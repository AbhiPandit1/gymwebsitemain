import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProgramme } from '../../../action/programmeActions';
import DashboardComponent from '../../../component/DashboardComponent';
import DashboardHeader from '../../../component/DashboardHeader';
import { useParams, useNavigate } from 'react-router-dom';
import useDashboardLinks from '../../../../hook/CreateDahsboardLinks';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { BiSolidRightArrow } from 'react-icons/bi';
import { toast } from 'react-toastify';

const AdminCreatingNewProgramme = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const token = user.token;

  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [categoryPhotoName, setCategoryPhotoName] = useState('');
  const [trainerMail, setTrainerMail] = useState(user.user.email);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState(['']);
  const [loadings, setLoadings] = useState(false);
  const [planType, setPlanType] = useState('');
  const [hoverDashboard, setHoverDashboard] = useState(false);

  const categoryOptions = [
    'Nutrition',
    'Bodybuilding',
    'Sports',
    'Women',
    'WeightLoss',
    'PowerLifting',
    'General',
    'Recovery',
    'Calisthenics',
  ];

  const handleMakeCategories = async (e) => {
    e.preventDefault();

    const formData = {
      category,
      price,
      discount,
      categoryPhoto,
      trainerMail,
      title,
      desc,
      planType,
    };
 console.log(formData)
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
            `/trainer/create/programme/day/plan/${user.user._id}/${programmeId}`
          );
        } else if (planType === 'Diet') {
          navigate(
            `/trainer/create/programme/diet/plan/${user.user._id}/${programmeId}`
          );
        } else if (planType === 'Both') {
          // Handle the "Both" case if needed
          navigate(
            `/trainer/create/programme/diet/plan/${user.user._id}/${programmeId}`
          );
        }
      }
    } catch (error) {
      toast.error('Error creating programme: ' + error.message);
    } finally {
      setLoadings(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setCategory([]);
    setPrice('');
    setDiscount('');
    setCategoryPhoto(null);
    setCategoryPhotoName('');
    setTrainerMail(user.user.email);
    setTitle('');
    setDesc(['']);
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

  const handleDescChange = (index, value) => {
    const newDesc = [...desc];
    newDesc[index] = value;
    setDesc(newDesc);
  };

  const handleAddDescField = () => {
    setDesc([...desc, '']);
  };

  const handleRemoveDescField = (index) => {
    const newDesc = desc.filter((_, i) => i !== index);
    setDesc(newDesc);
  };

  const dashBoardLink = useDashboardLinks();

  return (
    <div
      className="grid grid-cols-9 max-w-[100vw] text-white font-sans"
      style={{
        background: 'linear-gradient(180deg, #050c1e 0%, #050c1e 100%)',
      }}
    >
      <div className="col-span-9 sticky top-0 z-50">
        <DashboardHeader />
      </div>

      <div className="min-h-screen min-w-[100vw]">
        <h1 className="text-3xl font-extrabold text-center py-4">
          Create Program
        </h1>

        <div className="h-[80vh] overflow-auto p-6 w-full scrollbar-hide">
          <form className="flex flex-col gap-8" onSubmit={handleMakeCategories}>
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
            <div className="flex flex-wrap   gap-2 mb-4">
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
            <div className="flex  sm:pl-[8rem] flex-wrap gap-4 mb-4">
              {categoryOptions.map((option, idx) => (
                <div key={idx} className="flex  items-center">
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
            <div className="flex flex-col sm:pl-[8rem] mb-4">
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
                  <label htmlFor="diet-plan" className="text-white">
                    Diet
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
                  <label htmlFor="day-plan" className="text-white">
                    Day
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
                  <label htmlFor="both-plan" className="text-white">
                    Both
                  </label>
                </div>
              </div>
            </div>
            {/* Title and Description */}
            <div className="flex sm:px-[8rem] flex-col mb-4">
              <label className="text-white mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div className="flex flex-col sm:px-[8rem] mb-4">
              <label className="text-white mb-2">Description</label>
              {desc.map((description, index) => (
                <div key={index} className="flex items-center mb-2">
                  <textarea
                    value={description}
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    placeholder={`Description ${index + 1}`}
                    className="p-2 rounded bg-gray-800 text-white w-full"
                    rows="3"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDescField(index)}
                    className="ml-2 text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDescField}
                className="text-green-500"
              >
                Add Description Field
              </button>
            </div>

            {/* Price and Discount */}
            <div className="flex sm:px-[8rem] flex-col mb-4">
              <label className="text-white mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div className="flex sm:px-[8rem] flex-col mb-4">
              <label className="text-white mb-2">Discount</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Discount (e.g., 20%)"
                className="p-2 rounded bg-gray-800 text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`p-4 rounded sm:px-[8rem]  bg-blue-600 text-white ${
                loadings ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loadings}
            >
              {loadings ? 'Submitting...' : 'Create Programme'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatingNewProgramme;
