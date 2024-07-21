import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { toast } from 'react-toastify';
import { updateProgramme } from '../../action/programmeActions';
import Spinner from '../../component/Spinner';

const EditTrainerProgramme = () => {
  const { id } = useParams(); // Extract programme ID from URL
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = user?.token;

  const { programme } = useSelector((state) => state.programme);
  console.log(programme.programme);

  // State for form fields
  const [category, setCategory] = useState(''); // Default to empty string
  const [price, setPrice] = useState('');
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [trainerMail, setTrainerMail] = useState(user.user.email);
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

  const handleUpdateProgramme = async (e) => {
    e.preventDefault();

    // Validate that category is not empty
    if (!category) {
      toast.error('Please select a category.');

      return;
    }
    setLoading(true);

    try {
      const formData = {
        category,
        price,
        categoryPhoto,
        trainerMail,
        desc,
      };
      console.log(formData);

      // Dispatch action to update programme
      await dispatch(updateProgramme(formData, id, token));

      // Reset form fields after successful submission
      setCategory('');
      setPrice('');
      setCategoryPhoto(null);
      setTrainerMail(user.user.email);
      setDesc('');
      setLoading(false);
    } catch (error) {
      console.error('Error updating programme:', error);
      setLoading(true);
    }
  };

  const dashBoardLink = useDashboardLinks();

  return (
    <div className="grid grid-cols-7 h-screen">
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
          <div className="m-5 h-[80vh] overflow-auto p-6">
            <form
              className="flex flex-col gap-8"
              onSubmit={handleUpdateProgramme}
            >
              {/* Category */}
              <div className="flex justify-between w-full items-center px-[10%]">
                <label className="w-[20%]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-primary w-[40%] h-[2rem]"
                >
                  <option value="" disabled>
                    Select category
                  </option>
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

              {/* Image */}
              <div className="flex justify-between items-center">
                <label className="w-[20%]">Image</label>
                <input
                  type="file"
                  className="w-[60%] bg-white p-2 rounded text-primary"
                  name="categoryPhoto"
                  onChange={(e) => setCategoryPhoto(e.target.files[0])}
                />
              </div>

              {/* Price */}
              <div className="flex justify-between items-center">
                <label className="w-[20%]">Price</label>
                <input
                  type="number"
                  className="w-[60%] bg-white p-2 rounded text-primary"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Trainer Mail */}
              <div className="flex justify-between items-center">
                <label className="w-[20%]">Trainer Mail</label>
                <input
                  type="email"
                  className="w-[60%] bg-white p-2 rounded text-primary"
                  placeholder="Enter trainer email"
                  value={trainerMail}
                  onChange={(e) => setTrainerMail(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="w-[60%] text-center">Description</label>
                <textarea
                  rows={5}
                  className="w-full bg-white p-2 rounded resize-none text-primary"
                  placeholder="...desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
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
