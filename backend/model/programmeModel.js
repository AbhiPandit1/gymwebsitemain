import mongoose from 'mongoose';

const programmeSchema = new mongoose.Schema({
  category: {
    type: [String],
    enum: [
      'Nutrition',
      'Bodybuilding',
      'Sports',
      'Women',
      'WeightLoss',
      'PowerLifting',
      'General',
      'Recovery',
    ],
    required: true,
  },
  categoryPhoto: {
    public_id: { type: String },
    url: { type: String },
  },
  price: {
    type: Number,
    required: true,
    min: 10, // Ensuring the price is always greater than 10
  },
  desc: {
    type: String,
    required: true,
  },
  title: { type: String, required: true },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  planType: {
    type: String,
    enum: ['Diet', 'Day', 'Both'],
    required: true,
  },
});

programmeSchema.pre('save', async function (next) {
  if (this.trainer) {
    const User = mongoose.model('User');
    const user = await User.findById(this.trainer);
    if (!user || user.role !== 'trainer') {
      throw new Error('Assigned trainer must have a role of "trainer"');
    }
  }
  next();
});

const Programme = mongoose.model('Programme', programmeSchema);

export default Programme;
