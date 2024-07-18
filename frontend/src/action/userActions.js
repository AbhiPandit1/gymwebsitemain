import { toast } from 'react-toastify';
import {
  registerUserStart,
  registerUserSuccess,
  registerUserFailure,
  signInStart,
  signInSuccess,
  signInFailure,
  signOut,
  userDetailStart,
  userDetailSuccess,
  userDetailFailure,
} from '../reducers/userReducer'; // Assuming your path to userReducer is correct
import axios from 'axios';

const backendapi = import.meta.env.VITE_BACKEND_URL;

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerUserStart());
    const response = await axios.post(
      `${backendapi}/api/user/signin`,
      userData
    );

    // Check if registration was successful (assuming response status code or some success flag)
    if (response.status === 201) {
      dispatch(registerUserSuccess(response.data));
      localStorage.setItem('token', response.data.token);

      toast.success(response.data.message);
      return response;
    } else {
      throw new Error('Failed to register user'); // Handle other status codes or flags if needed
    }
  } catch (error) {
    dispatch(registerUserFailure(error.message));
    toast.error(error.message.message);
  }
};

export const signInuser = (userData) => async (dispatch) => {
  try {
    dispatch(signInStart()); // Dispatching the action to set loading state
    const response = await axios.post(`${backendapi}/api/signin`, userData);

    // Assuming sign-in is successful if response status is 201
    if (response.status === 201) {
      dispatch(signInSuccess(response.data)); // Dispatching success action with user data
      toast.success('User signed in successfully'); // Showing success message
    } else {
      throw new Error('Failed to sign in'); // Throwing an error if sign-in fails
    }
  } catch (error) {
    dispatch(signInFailure(error.message)); // Dispatching failure action with error message
    toast.error(error.message); // Showing error message using toast
  }
};

export const signOutUser = () => async (dispatch) => {
  try {
    const response = await axios.post(`${backendapi}/api/signout`);
    dispatch(signOut()); // Dispatch the signOut action if the sign-out request succeeds
    localStorage.removeItem('token', response.data.token);

    toast.success('Signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Failed to sign out. Please try again.');
  }
};

export const updateUserDetail = (userDetail, id) => async (dispatch) => {
  try {
    dispatch(userDetailStart()); // Dispatch action to indicate start of request

    const response = await axios.put(
      `${backendapi}/api/user/detail/${id}`,
      userDetail
    );

    const { user, token } = response.data;

    // Store token in localStorage if needed
    localStorage.setItem('token', token);

    dispatch(userDetailSuccess(response.data));

    toast.success('User updated successfully');
    console.log('Updated user:', user);

    return { user, token }; // Return user and token for further use if needed
  } catch (error) {
    console.error('Error updating user:', error); // Log the error for debugging
    dispatch(userDetailFailure(error.message));
    toast.error('Failed to update user');
    throw error; // Rethrow the error to handle it elsewhere if necessary
  }
};
