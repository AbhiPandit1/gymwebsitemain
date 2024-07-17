import mongoose from 'mongoose';

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected on ${process.env.MONGO_URI}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Throw error to reject the promise in case of failure
  }
};

export default databaseConnection;
