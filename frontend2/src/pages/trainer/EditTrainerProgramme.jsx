import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { toast } from 'react-toastify';
import { updateProgramme } from '../../action/programmeActions';
import Spinner from '../../component/Spinner';
import { FaPlus, FaTimes } from 'react-icons/fa';

const EditTrainerProgramme = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const token = user?.token;
  const { programme } = useSelector((state) => state.programme);

  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [categoryPhotoName, setCategoryPhotoName] = useState('');
  const [trainerMail, setTrainerMail] = useState(user.user.email);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    'Nutrients',
    'Bodybuilding',
    'Sports',
    'Women',
    'WeightLoss',
    'PowerLifting',
    'General',
  ];

  useEffect(() => {
    if (programme && programme.programme) {
      const prog = programme.programme.find((p) => p._id === id);
      if (prog) {
        setCategory(prog.category);
        setPrice(prog.price);
        setCategoryPhotoName(prog.categoryPhoto?.url || '');
        setTrainerMail(prog.trainerMail);
        setTitle(prog.title || '');
        setDesc(prog.desc);
      }
    }
  }, [programme, id]);

  const handleUpdateProgramme = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error('Please select a category.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('category', category || ''); // Use empty string if category is undefined
      formData.append('price', price || ''); // Use empty string if price is undefined
      if (categoryPhoto) formData.append('categoryPhoto', categoryPhoto);
      formData.append('trainerMail', trainerMail || ''); // Use empty string if trainerMail is undefined
      formData.append('title', title || ''); // Use empty string if title is undefined
      formData.append('desc', desc || ''); // Use empty string if desc is undefined

      const response = await dispatch(updateProgramme(formData, id, token));

      if (response?.status === 200 || response?.status === 201) {
        resetForm();
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
  console.log('FormData Values:', {
    category,
    price,
    title,
    desc,
    categoryPhoto,

    trainerMail,
  });

  const resetForm = () => {
    setCategory('');
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
    console.log(categoryPhoto);
    setCategoryPhotoName(file ? file.name : '');
  };

  const handleClearFile = () => {
    setCategoryPhoto(null);
    setCategoryPhotoName('');
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

              {/* Category, Price, and Title */}
              <div className="flex flex-col sm:flex-row justify-around items-center w-full">
                <div className="flex flex-col w-full sm:w-[45%] mb-4 sm:mb-0">
                  <label className="text-white mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-12 bg-tertiary text-white p-2 rounded-[16px]"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((option, idx) => (
                      <option
                        key={idx}
                        value={option}
                        className="bg-white text-primary"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
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
              </div>

              {/* Title and Trainer Mail */}
              <div className="flex flex-col sm:flex-row justify-around items-center w-full">
                <div className="flex flex-col w-full sm:w-[45%] mb-4 sm:mb-0">
                  <label className="text-white mb-2">Programme Title</label>
                  <input
                    type="text"
                    className="w-full h-12 bg-tertiary text-white p-2 rounded-[16px]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
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
                    loading ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTrainerProgramme;
