import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
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
  const [desc, setDesc] = useState(['']);
  const [loading, setLoading] = useState(false);

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

  // Load programme details into the form when the component mounts
  useEffect(() => {
    if (programme && programme.programme) {
      const prog = programme.programme;
      setCategory(prog.category || []);
      setPrice(prog.price || '');
      setCategoryPhotoName(prog.categoryPhotoName || '');
      setTrainerMail(prog.trainerMail || user?.user?.email);
      setTitle(prog.title || '');
      setDesc(prog.desc || ['']);
    }
  }, [programme, user]);

  const handleUpdateProgramme = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', JSON.stringify(category)); // Convert array to string
    formData.append('price', price);
    if (categoryPhoto) formData.append('categoryPhoto', categoryPhoto);
    formData.append('trainerMail', trainerMail);
    formData.append('title', title);
    formData.append('desc', JSON.stringify(desc)); // Convert array to string

    try {
      setLoading(true);
      const response = await dispatch(updateProgramme(formData, id, token));

      if (response?.status === 200) {
        toast.success('Programme updated successfully');
        navigate(`/user/dashboard/${user.user._id}`);
      }
    } catch (error) {
      toast.error('Error updating programme: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategory((prevCategory) =>
      checked
        ? [...prevCategory, value]
        : prevCategory.filter((cat) => cat !== value)
    );
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
    <div className="grid grid-cols-9 gap-[2rem] max-h-[100vh] max-w-[100vw] bg-gray-900">
      <div className="hidden sm:col-span-1 sm:grid bg-gray-900 text-white">
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>

      <div className="col-span-9 sm:col-span-8 bg-gray-900 text-white">
        <div className="h-full">
          <DashboardHeader />

          <h1 className="text-3xl font-extrabold text-center py-4">
            Edit Program
          </h1>

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
                      onClick={() =>
                        setCategory((prevCategory) =>
                          prevCategory.filter((c) => c !== cat)
                        )
                      }
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

              {/* Price, Title, and Trainer Mail */}
              <div className="flex flex-col gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Price > $10"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="p-2 rounded-lg bg-gray-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-2 rounded-lg bg-gray-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Trainer Mail"
                  value={trainerMail}
                  onChange={(e) => setTrainerMail(e.target.value)}
                  className="p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col mb-4">
                <label className="text-white mb-2">Description</label>
                {desc.map((paragraph, index) => (
                  <div key={index} className="flex flex-col mb-2">
                    <textarea
                      placeholder={`Description ${index + 1}`}
                      value={paragraph}
                      onChange={(e) => handleDescChange(index, e.target.value)}
                      className="p-2 rounded bg-gray-700 text-white"
                      rows="4"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDescField(index)}
                      className="mt-2 text-red-500"
                    >
                      <FaTimes /> Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddDescField}
                  className="mt-2 text-blue-500"
                >
                  <FaPlus /> Add Description
                </button>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Programme'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTrainerProgramme;
