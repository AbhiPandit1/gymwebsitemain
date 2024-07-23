import React, { useEffect, useState } from 'react';
import DashboardComponent from '../../component/DashboardComponent';
import DashboardHeader from '../../component/DashboardHeader';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdDelete, MdEdit } from 'react-icons/md';
import { GiAbdominalArmor } from 'react-icons/gi';
import useDashboardLinks from '../../../hook/CreateDahsboardLinks';
import { toast } from 'react-toastify';

// Import a modal library if needed, e.g.:
// import Modal from 'react-modal';

const PersonalTrainerProgramme = () => {
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [trainerDatas, setTrainerDatas] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const dashBoardLink = useDashboardLinks();

  useEffect(() => {
    const getProgramme = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/admin/trainer/programme/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setTrainerDatas(response.data.programmes);
        console.log(trainerDatas._id);
      } catch (error) {
        console.log(error);
      }
    };
    getProgramme();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/trainer/programme`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: { programmeId: deleteId },
        }
      );
      setTrainerDatas(
        trainerDatas.filter((data) => {
          data._id !== deleteId;
        })
      );
      window.location.reload();
      setShowDeletePopup(false);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete programme.');
    }
  };

  return (
    <div className="grid sm:grid-cols-7 text-white font-sans max-w-[100vw]">
      <div className="col-span-2 hidden sm:grid">
        <DashboardComponent dashBoardLink={dashBoardLink} />
      </div>
      <div className="col-span-5">
        <div>
          <DashboardHeader />
        </div>
        <div className="grid grid-cols-3 m-auto sm:pl-5 w-full max-h-full sm:max-h-[80vh] overflow-auto">
          <div className="col-span-3 items-start justify-center overflow-auto">
            <div className="grid grid-cols-1 p-2 mr-5 sm:grid-cols-3 gap-2 overflow-auto">
              {trainerDatas.map((card) => (
                <div
                  key={card.id}
                  className="bg rounded-[32px] gap-[5px] min-h-[400px] p-4 bg-tertiary w-full sm:w-[300.4px] m-[1rem] p-auto"
                >
                  <img
                    src={card.categoryPhoto.url || <GiAbdominalArmor />}
                    alt={card.type}
                    className="h-[249px] object-cover rounded-[50px] p-4 opacity-1"
                  />
                  <div className="h-[2rem] max-w-[5rem] m-[5%] text-[0.8rem] rounded-[10px] bg-paraColor font-sans flex justify-center items-center">
                    Category
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl text-white font-sans font-bold">
                      {card.category}
                    </h2>
                  </div>
                  <div className="font-sans text-1xl text-paraColor w-[90%] m-[5%]">
                    {card.desc}
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xl text-white font-sans font-bold flex justify-center items-center m-2">
                      ${card.price}
                    </div>
                    <button
                      onClick={() => {
                        setDeleteId(card._id);
                        setShowDeletePopup(true);
                      }}
                      className="w-[3.6rem] h-[3.2rem] bg-red-500 flex items-center justify-center ml-4 mr-2 rounded-xl float-right"
                    >
                      <MdDelete color="black" className="w-14 h-10" />
                    </button>
                    <Link to={`/trainer/programme/edit/${card._id}`}>
                      <button className="w-[3.6rem] h-[3.2rem] bg-red-500 flex items-center justify-center ml-4 mr-2 rounded-xl float-right">
                        <MdEdit color="black" className="w-14 h-10" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link to={`/trainer/create/programme/${user.user._id}`}>
              <div className="bg-tertiary m-auto w-[80%] sm:w-[40%] flex justify-center gap-3 items-center rounded-lg mb-[5rem]">
                <div className="flex justify-center items-center">
                  <span className="text-white text-[2.5rem] flex justify-center items-center">
                    +
                  </span>
                </div>
                <div className="flex justify-center items-center placeholder">
                  <p className="text-white font-sans text-[2rem] font-bold">
                    Create New
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-primary p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete this programme?
            </p>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeletePopup(false)}
              className="bg-gray-300 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTrainerProgramme;
