import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BiSolidRightArrow } from 'react-icons/bi';

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
  const [discount, setDiscount] = useState(''); // Added state for discount
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [categoryPhotoName, setCategoryPhotoName] = useState('');
  const [trainerMail, setTrainerMail] = useState(user?.user?.email || '');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState(['']);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (programme && programme.programme) {
      const prog = programme.programme;
      setCategory(prog.category || []);
      setPrice(prog.price || '');
      setDiscount(prog.discount || ''); // Set discount value
      setCategoryPhotoName(prog.categoryPhotoName || '');
      setTrainerMail(prog.trainerMail || user?.email);
      setTitle(prog.title || '');
      setDesc(prog.desc || ['']);
    }
  }, [programme, user]);

  const handleUpdateProgramme = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', JSON.stringify(category));
    formData.append('price', price);
    formData.append('discount', discount); // Append discount
    if (categoryPhoto) formData.append('categoryPhoto', categoryPhoto);
    formData.append('trainerMail', trainerMail);
    formData.append('title', title);
    formData.append('desc', JSON.stringify(desc));

    try {
      setLoading(true);
      const response = await dispatch(updateProgramme(formData, id, token));

      if (response?.status === 200) {
        toast.success('Programme updated successfully');
        navigate(`/user/dashboard/${user._id}`);
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

  const handleClick = () => {
    setHoverDashboard((prev) => !prev);
  };

  const dashboardLink = useDashboardLinks();

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

      <div className='min-h-screen min-w-[100vw]'>
        <h1 className="text-3xl font-extrabold text-center py-4">
          Edit Program
        </h1>

        <div className="h-[80vh] overflow-auto p-6 w-full min-h-screen">
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

            {/* Price, Discount, Title, and Trainer Mail */}
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="text"
                placeholder="Price > $10"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-2 rounded-lg bg-gray-700 text-black"
              />
              <input
                type="text"
                placeholder="Discount (e.g., 20%)"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="p-2 rounded-lg bg-gray-700 text-black"
              />
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 rounded-lg bg-gray-700 text-black"
              />
              <input
                type="email"
                placeholder="Trainer Mail"
                value={trainerMail}
                onChange={(e) => setTrainerMail(e.target.value)}
                className="p-2 rounded-lg bg-gray-700 text-black"
              />
            </div>

            {/* Description Fields */}
            <div className="flex flex-col gap-4 mb-4">
              {desc.map((descItem, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={descItem}
                    onChange={(e) => handleDescChange(index, e.target.value)}
                    className="p-2 rounded-lg bg-gray-700 text-black w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDescField(index)}
                    className="text-red-500"
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

            <button
              type="submit"
              className="bg-blue-500 text-white p-4 rounded-lg"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Programme'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrainerProgramme;
