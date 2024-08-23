import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  meal: {
    type: String,
    required: true,
  },
});

const dayPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  meals: [mealSchema],
});

const dietPlanSchema = new mongoose.Schema({
  days: [dayPlanSchema],
  programme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programme',
    required: true,
  },
});

// Define the DietPlan model using the correct schema
const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan;
