import axios from 'axios';
// Adjust the path as necessary
import { toast } from 'react-toastify';
import {
  createProgrammeFailure,
  createProgrammeStart,
  createProgrammeSuccess,
  getProgrammeFailure,
  getProgrammeStart,
  getProgrammeSuccess,
} from '../reducers/programmeReducer';

const backendapi = import.meta.env.VITE_BACKEND_URL;
export const createProgramme =
  (programmeData, userId, token) => async (dispatch) => {
    try {
      dispatch(createProgrammeStart()); // Dispatch the action creator function

      const formData = new FormData();
      formData.append('category', JSON.stringify(programmeData.category));
      formData.append('price', programmeData.price);
      formData.append('desc', JSON.stringify(programmeData.desc)); // Convert desc array to JSON string
      formData.append('title', programmeData.title);
      formData.append('planType', programmeData.planType); // Add planType to formData

      if (programmeData.categoryPhoto) {
        formData.append('categoryPhoto', programmeData.categoryPhoto);
      }
      if (programmeData.trainerMail) {
        formData.append('trainerEmail', programmeData.trainerMail); // Make sure this matches the server-side field name
      }

      const response = await axios.post(
        `${backendapi}/api/admin/programme/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 201) {
        // Status 201 for successful creation
        toast.success('Programme Created');
        dispatch(createProgrammeSuccess(response.data.programme)); // Dispatch success action with payload
      }
      return response;
    } catch (error) {
      console.error('Error creating programme:', error);
      toast.error(error.response?.data?.error || 'Error creating programme');
      dispatch(
        createProgrammeFailure(error.response?.data?.error || error.message)
      );
    }
  };

export const updateProgramme =
  (formData, programmeId, token) => async (dispatch) => {
    dispatch(createProgrammeStart());

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/trainer/programme/${programmeId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Programme updated successfully');
        dispatch(createProgrammeSuccess(response.data.programme));
      } else {
        const errorMessage =
          response.data.error || 'Failed to update programme';
        toast.error(errorMessage);
        dispatch(createProgrammeFailure(errorMessage));
      }

      return response;
    } catch (error) {
      console.error('Error updating programme:', error);

      const errorMessage =
        error.response?.data?.error ||
        'An error occurred while updating the programme';
      toast.error(errorMessage);
      dispatch(createProgrammeFailure(errorMessage));
    }
  };
export const getProgramme = () => async (dispatch) => {
  try {
    dispatch(getProgrammeStart());

    const response = await axios.get(`${backendapi}/api/admin/category`);

    if (response.status === 200) {
      dispatch(getProgrammeSuccess(response.data));

      return response.data; // Return the response data for further processing if needed
    } else {
      dispatch(getProgrammeFailure('No programme data found'));
      toast.error('No programme data found');
    }
  } catch (error) {
    dispatch(getProgrammeFailure(error.message));
    toast.error(error.message);
  }
};
