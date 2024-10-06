import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdDelete, MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';

const PersonalTrainerProgramme = ({ id }) => {
  const { user } = useSelector((state) => state.user);

  const [trainerDatas, setTrainerDatas] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const cardContainerRef = useRef(null);
  console.log(id);

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
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch data.');
      }
    };
    getProgramme();
  }, [id, user.token]);

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

      setTrainerDatas(trainerDatas.filter((data) => data._id !== deleteId));
      setShowDeletePopup(false);
      toast.success('Programme deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete programme.');
    }
  };

  const scrollLeft = () => {
    cardContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    cardContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center text-white">
      {/* Horizontal Card Scroll Area */}
      <div className="relative w-full overflow-hidden">
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full z-10"
          onClick={scrollLeft}
        >
          &lt;
        </button>
        <div
          ref={cardContainerRef}
          className="flex gap-5 overflow-x-scroll p-5 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {trainerDatas?.map((card) => (
            <div
              key={card?._id}
              className="flex-shrink-0 bg-gray-800 w-[300px] border-b-4 border-orange-600 shadow-lg relative overflow-hidden"
            >
              <div className="relative">
                <img
                  src={card?.categoryPhoto?.url}
                  alt={card?.type}
                  className="h-[200px] w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-white text-xl font-semibold mb-2">
                  {card.title}
                </h2>
                <h2 className="text-white text-xl font-semibold mb-2">
                  ${card.price}
                </h2>
                <p className="text-white text-sm mb-4">
                  {card.desc.length > 50
                    ? `${card.desc.slice(0, 50)}...`
                    : card.desc}
                </p>
                <div className="flex justify-between gap-4 mt-2">
                  <Link
                    to={`/trainer/programme/edit/${card._id}`}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400"
                  >
                    <MdEdit />
                  </Link>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400"
                    onClick={() => {
                      setDeleteId(card._id);
                      setShowDeletePopup(true);
                    }}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full z-10"
          onClick={scrollRight}
        >
          &gt;
        </button>
      </div>

      {/* Create New Button */}
      <div className="mt-6">
        <Link to={`/trainer/create/programme/${user.user._id}`}>
          <button className="bg-green-600 text-white py-2 px-6 rounded-lg">
            Create New +
          </button>
        </Link>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-primary p-6 rounded-lg text-center">
            <p>Are you sure you want to delete this programme?</p>
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTrainerProgramme;
