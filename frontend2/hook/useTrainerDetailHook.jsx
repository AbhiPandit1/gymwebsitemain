// hooks/useTrainerDetailHook.js
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests
import { toast } from 'react-toastify'; // Import toast for error notifications
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

const useTrainerDetailHook = (trainerId) => {
  const [trainer, setTrainer] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userTrainerDetails, setUserTrainerDetails] = useState(null);
  const backendapi = import.meta.env.VITE_BACKEND_URL;
  const { user } = useSelector((state) => state.user); // Access user from Redux state

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendapi}/api/trainer/about/get/detail/${trainerId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setTrainer(response.data.trainer);
        setDescription(response.data.description);
        setLoading(false);
        setUserTrainerDetails(response.data.user);
      } catch (error) {
        setLoading(false);
        setError(error);
        toast.error(
          error.response?.data?.message || 'Error fetching trainer details'
        );
      }
    };

    if (trainerId && user.token) {
      fetchTrainerDetails();
    }
  }, [trainerId, user.token, backendapi]);

  return { trainer, description, loading, error, userTrainerDetails };
};

export default useTrainerDetailHook;
