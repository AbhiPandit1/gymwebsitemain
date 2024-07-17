import Payment from '../model/payementModel.js';
import Programme from '../model/programmeModel.js';
import User from '../model/userModel.js';

export const getAllBuyedProgramme = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Assuming user.takenProgrammes is an array of programme IDs
    const programmeIds = user.takenProgrammes;

    // Fetch all programmes details from Programme model based on IDs
    const programmeDetailsPromises = programmeIds.map(async (programmeId) => {
      const programme = await Programme.findById(programmeId);
      if (!programme) {
        throw new Error(`Programme with ID ${programmeId} not found`);
      }
      return programme; // Return only the programme object
    });

    // Resolve all promises to get the details of all programmes
    const programmeDetails = await Promise.all(programmeDetailsPromises);
    console.log(programmeDetails);

    // Map the programme details to include an index (assuming a serial index starting from 1)

    // Return the indexed programme details as JSON response
    return res.status(200).json({ programmeDetails });
  } catch (error) {
    console.error(error.message); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllInvoice = async (req, res) => {
  const id = req.params.id;

  const paymentDetails = await Payment.find({ userId: id });
};
