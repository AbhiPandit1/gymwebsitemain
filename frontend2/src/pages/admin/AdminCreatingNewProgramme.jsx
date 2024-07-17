import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProgramme } from '../../action/programmeActions';
import { toast } from 'react-toastify';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import { useParams } from 'react-router-dom';

const AdminCreatingNewProgramme = () => {
  
  {
    /*/admin/create/programme/:id */
  }
  const { id } = useParams();
  console.log(id);
  const dispatch = useDispatch();

  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [categoryPhoto, setCategoryPhoto] = useState(null);
  const [trainerMail, setTrainerMail] = useState('');
  const [desc, setDesc] = useState('');

  const { user } = useSelector((state) => state.user);

  const categoryOptions = [
    'Nutrients',
    'Bodybuilding',
    'Sports',
    'Women',
    'WeightLoss',
    'PowerLifting',
    'General',
  ];

  const handleMakeCategories = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        category,
        price,
        categoryPhoto,
        trainerMail,
        desc,
      };

      // Dispatch action to create programme
      await dispatch(createProgramme(formData, id));

      // Reset form fields after successful submission
      setCategory('');
      setPrice('');
      setCategoryPhoto(null);
      setTrainerMail('');
      setDesc('');

      toast.success('Programme Created');
    } catch (error) {
      console.error('Error creating programme:', error);
      toast.error('Something went wrong');
    }
  };

  const dashBoardLink = [
    { id: '1', name: 'Home', link: '/', role: 'user' },
    { id: '2', name: 'My Programs', link: '/programs', role: '' },
    { id: '3', name: 'Settings', link: '/settings' },
    {
      id: '4',
      name: 'Edit',
      link: `/admin/create/programme/${user._id}`,
      role: 'admin',
    },
  ];

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
            Create Programme
          </h1>

          {/* Form */}
          <div className="m-5 h-[80vh] overflow-auto p-6 w-max-[100vw]">
            <form
              className="flex flex-col gap-8 m-2"
              onSubmit={handleMakeCategories}
            >
              {/* Category */}
              <div className="flex justify-between w-full sm:justify-between items-center pl-[10%] pr-[10%]">
                <label className="w-[20%]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-primary w-[40%] h-[2rem]"
                >
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
              <div className="flex justify-between sm:justify-center items-center">
                <label className="w-[20%]">Image</label>
                <input
                  type="file"
                  className="w-[60%] bg-white p-2 rounded text-primary"
                  name="categoryPhoto"
                  onChange={(e) => setCategoryPhoto(e.target.files[0])}
                />
              </div>

              {/* Price */}
              <div className="flex justify-between sm:justify-center items-center">
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
              <div className="flex justify-between sm:justify-center items-center">
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
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Submit
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
