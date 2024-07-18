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
export const createProgramme = (programmeData, userId) => async (dispatch) => {
  try {
    dispatch(createProgrammeStart()); // Dispatch the action creator function

    const formData = new FormData();
    formData.append('category', programmeData.category);
    formData.append('price', programmeData.price);
    if (programmeData.categoryPhoto) {
      formData.append('categoryPhoto', programmeData.categoryPhoto);
    }
    if (programmeData.trainerMail) {
      formData.append('trainerMail', programmeData.trainerMail);
    }
    formData.append('desc', programmeData.desc);

    const response = await axios.post(
      `${backendapi}/api/admin/programme/${userId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    if (response.data.success) {
      toast.success('Programme Created');
      dispatch(createProgrammeSuccess(response.data.programme)); // Dispatch success action with payload
    } else {
      toast.error(response.data.error);
      dispatch(createProgrammeFailure(response.data.error)); // Dispatch failure action with error payload
    }
  } catch (error) {
    console.error('Error creating programme:', error);
    toast.error('Something went wrong');
    dispatch(createProgrammeFailure(error)); // Dispatch failure action with error payload
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
