import Payment from '../model/payementModel.js';
import Programme from '../model/programmeModel.js';
import Trainer from '../model/trainerModel.js';
import User from '../model/userModel.js';

export const getAllBuyedProgramme = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId and exclude the password field
    const user = await User.findById(userId).select('-password');

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the array of programme IDs from the user's takenProgrammes field
    const programmeIds = user.takenProgrammes;

    // If no programmes are found, return an empty response
    if (!programmeIds || programmeIds.length === 0) {
      return res.status(200).json({
        availableProgrammes: [],
        message: 'No programmes found for the user',
      });
    }

    // Fetch the details of all programmes that are available in the database
    const programmeDetails = await Promise.all(
      programmeIds.map(async (programmeId) => {
        try {
          // Populate the trainer field and exclude trainer password
          const programme = await Programme.findById(programmeId).populate(
            'trainer',
            '-password'
          );

          // If the programme exists, return its details
          if (programme) {
            return {
              ...programme.toObject(),
              trainerId: programme.trainer ? programme.trainer._id : null,
            };
          } else {
            return null;
          }
        } catch (err) {
          // Log the error if a specific programme fetch failed
          console.error(
            `Error fetching programme with ID ${programmeId}:`,
            err
          );
          return null;
        }
      })
    );

    // Filter out any null values (programmes that were not found or had errors)
    const availableProgrammes = programmeDetails.filter(
      (programme) => programme !== null
    );

    // Return the details of the available programmes as the response
    return res.status(200).json({ availableProgrammes });
  } catch (error) {
    // Log the error message for debugging
    console.error('Server error:', error.message);

    // Return a server error response
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllInvoice = async (req, res) => {
  const id = req.params.id;

  const paymentDetails = await Payment.find({ userId: id });
};
