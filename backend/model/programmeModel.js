import mongoose from 'mongoose';

const programmeSchema = new mongoose.Schema({
  category: {
    type: String,
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
  },
  categoryPhoto: {
    public_id: { type: String }, // Add these fields to store Cloudinary data
    url: { type: String },
  },
  price: Number,
  desc: String,
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Middleware to ensure trainer is a user with the role 'trainer'
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
