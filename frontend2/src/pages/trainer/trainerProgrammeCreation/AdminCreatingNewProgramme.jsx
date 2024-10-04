import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProgramme } from '../../../action/programmeActions';
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
  const [discount, setDiscount] = useState(0);
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [categoryPhotoName, setCategoryPhotoName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
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

  // Load data from local storage on page load
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('programmeData'));
    if (savedData) {
      setCategory(savedData.category || []);
      setPrice(savedData.price || '');
      setDiscount(savedData.discount || 0);
      setCategoryPhoto(savedData.categoryPhoto || null);
      setCategoryPhotoName(savedData.categoryPhotoName || '');
      setTrainerMail(savedData.trainerMail || user.user.email);
      setTitle(savedData.title || '');
      setDesc(savedData.desc || ['']);
      setPlanType(savedData.planType || '');
    }
  }, [user.user.email]);

  // Save form data to local storage on change
  useEffect(() => {
    const formData = {
      category,
      price,
      discount,
      categoryPhoto,
      categoryPhotoName,
      trainerMail,
      title,
      desc,
      planType,
    };
    localStorage.setItem('programmeData', JSON.stringify(formData));
  }, [
    category,
    price,
    discount,
    categoryPhoto,
    categoryPhotoName,
    trainerMail,
    title,
    desc,
    planType,
  ]);

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

    try {
      setLoadings(true);
      const response = await dispatch(createProgramme(formData, id, token));

      if (response?.status === 201) {
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

        // Clear form data from local storage upon successful submission
        localStorage.removeItem('programmeData');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error creating programme: ' + error.message);
    } finally {
      setLoadings(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setCategory([]);
    setPrice('');
    setDiscount(0);
    setCategoryPhoto(null);
    setCategoryPhotoName('');
    setTrainerMail(user.user.email);
    setTitle('');
    setDesc(['']);
    setPlanType('');
    setUploadProgress(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryPhoto(file);
      setCategoryPhotoName(file.name);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress < 100) {
            return prevProgress + 10;
          }
          clearInterval(interval);
          return 100;
        });
      }, 100);
    }
  };

  const handleClearFile = () => {
    setCategoryPhoto(null);
    setCategoryPhotoName('');
    setUploadProgress(0);
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
    if (uploadProgress === 100) {
      setCategory((prevCategory) =>
        prevCategory.filter((cat) => cat !== categoryToRemove)
      );
    }
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
                  {categoryPhotoName && categoryPhoto instanceof File ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={URL.createObjectURL(categoryPhoto)}
                        alt={categoryPhotoName}
                        className="w-20 h-20 object-cover rounded-full"
                      />
                      <h1 className="text-white font-sans">
                        {uploadProgress}% uploaded
                      </h1>
                      <button
                        type="button"
                        className="text-white"
                        onClick={handleClearFile}
                        disabled={uploadProgress < 100}
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
                    disabled={uploadProgress < 100}
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

            {/* Programme Information */}
            <div className="flex gap-6">
              {/* Title */}
              <div className="w-full sm:ml-12 sm:pr-12">
                <input
                  className="p-2 rounded-lg w-full bg-tertiary text-white"
                  placeholder="Programs Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Price */}
              <div className="w-full sm:ml-12 sm:pr-12">
                <input
                  className="p-2 rounded-lg w-full bg-tertiary text-white"
                  placeholder="Price > $10"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Discount */}
            <div className="w-full sm:ml-12 sm:pr-12">
              <input
                className="p-2 rounded-lg w-full bg-tertiary text-white"
                placeholder="Discount (e.g., 10%)"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
              />
            </div>

            {/* Plan Type */}
            <div className="w-full sm:ml-12 sm:pr-12">
              <select
                className="p-2 rounded-lg w-full bg-tertiary text-white"
                value={planType}
                onChange={handlePlanTypeChange}
                required
              >
                <option value="">Select Plan Type</option>
                <option value="Day">Workout Plan</option>
                <option value="Diet">Diet Plan</option>
                <option value="Both">Both</option>
              </select>
            </div>

            {/* Description Fields */}
            {/* Description Fields */}
            <div className="w-full">
              {desc.map((description, index) => (
                <div key={index} className="flex mt-5 gap-2 items-center">
                  <textarea
                    className="p-2 rounded-lg w-full bg-tertiary text-white"
                    value={description}
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDescField(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
                onClick={handleAddDescField}
              >
                Add Description
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                disabled={loadings}
              >
                {loadings ? 'Loading...' : 'Create Programs'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatingNewProgramme;
