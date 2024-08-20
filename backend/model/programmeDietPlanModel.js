import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  breakfast: String,
  lunch: String,
  dinner: String,
});

const dietPlanSchema = new mongoose.Schema({
  days: [
    {
      day: {
        type: String,
        required: true,
      },
      meals: mealSchema,
    },
  ],
  programme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programme',
    required: true,
  },
});

export default mongoose.model('DietPlan', dietPlanSchema);
