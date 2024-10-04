import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const usePostDayPlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dayPlans, setDayPlans] = useState([]);
  const backendapi = import.meta.env.VITE_BACKEND_URL;

  const postDayPlan = async (programmeId, dayPlan, trainingPlan) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formattedData = {
      days: dayPlan.map((day) => ({
        day: day.day,
        exercises: day.exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          description: exercise.description, // Include the description field
          video: {
            name: exercise.videoName,
            url: exercise.video,
          },
        })),
      })),
    };

    try {
      const response = await fetch(
        `${backendapi}/api/trainer/programme/${programmeId}/day/plan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to post day plan');
      }

      toast.success('Day plan submitted successfully!');
      localStorage.removeItem('trainingPlan', JSON.stringify(trainingPlan));
      setSuccess(true);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDayPlan = async (programmeId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.get(
        `${backendapi}/api/trainer/programme/${programmeId}/day/plans`
      );

      setDayPlans(response.data);
      toast.success('Day plans fetched successfully!');
      setSuccess(true);
      return response.data;
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDayPlan = async (programmeId, planId, updatedDayPlan) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${backendapi}/api/trainer/programme/${programmeId}/day/plan/${planId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDayPlan),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update day plan');
      }

      const data = await response.json();
      toast.success('Day plan updated successfully!');
      setSuccess(true);
      return data;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    dayPlans,
    postDayPlan,
    getDayPlan,
    updateDayPlan,
  };
};

export default usePostDayPlan;
