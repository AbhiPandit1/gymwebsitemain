import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the exercise
  sets: { type: Number, default: 0 }, // Number of sets
  reps: { type: Number, default: 0 }, // Number of repetitions
  videoName: { type: String, default: '' }, // Name of the video file
  videoUrl: { type: String, default: '' }, // URL of the exercise video
});

const dayPlanSchema = new mongoose.Schema({
  day: { type: String, required: true },
  exercises: [exerciseSchema], // Array of exercise objects

  programme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programme',
    required: true,
  },
});

// Export the DayPlan model
const DayPlan = mongoose.model('DayPlan', dayPlanSchema);

export default DayPlan;
