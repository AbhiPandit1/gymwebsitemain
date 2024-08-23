import Payment from '../model/payementModel.js';
import Programme from '../model/programmeModel.js';
import Trainer from '../model/trainerModel.js';
import User from '../model/userModel.js';

export const getAllBuyedProgramme = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  try {
    // Find the user by userId
    const user = await User.findById(userId).select('-password'); // Exclude password from the user document

    // If the user is not found, return an error
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Extract the array of programme IDs from the user's takenProgrammes field
    const programmeIds = user.takenProgrammes;

    // Fetch the details of all programmes that are available in the database
    const programmeDetails = await Promise.all(
      programmeIds.map(async (programmeId) => {
        // Fetch the programme and populate the trainer field
        const programme = await Programme.findById(programmeId).populate(
          'trainer'
        );

        if (programme) {
          // Remove the password field from the trainer object
          const trainer = programme.trainer
            ? { ...programme.trainer.toObject(), password: undefined }
            : null;

          return {
            ...programme.toObject(),
            trainer, // Include the modified trainer object
            trainerId: trainer ? trainer._id : null, // Include the trainerId if available
          };
        }
        return null; // Return null if the programme was not found
      })
    );
    console.log(programmeDetails);

    // Filter out any null values (programmes that were not found)
    const availableProgrammes = programmeDetails.filter(
      (programme) => programme !== null
    );

    // Return the details of the available programmes as the response
    return res.status(200).json({ availableProgrammes });
  } catch (error) {
    // Log the error message for debugging
    console.error(error.message);

    // Return a server error response
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllInvoice = async (req, res) => {
  const id = req.params.id;

  const paymentDetails = await Payment.find({ userId: id });
};
