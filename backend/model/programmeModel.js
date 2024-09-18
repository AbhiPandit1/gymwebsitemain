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
      'Calisthenics',
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
    type: [String], // Change desc to be an array of strings
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
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
  isSelected: {
    type: Boolean,
    default: false, // Default to false if not set
  },
  discount: {
    type: Number,
    default: 0, // Default discount is 0
    min: 0, // Ensuring discount is non-negative
  },
});

// Virtual field to calculate the discounted price
programmeSchema.virtual('discountedPrice').get(function () {
  return this.price - this.price * (this.discount / 100);
});

// Indexing for improved performance
programmeSchema.index({ category: 1 });
programmeSchema.index({ trainer: 1 });

// Hook to ensure the trainer has the role of 'trainer'
programmeSchema.pre('save', async function (next) {
  if (this.trainer) {
    const User = mongoose.model('User');
    const user = await User.findById(this.trainer);
    if (!user || user.role !== 'trainer') {
      return next(new Error('Assigned trainer must have a role of "trainer"'));
    }
  }
  next();
});

const Programme = mongoose.model('Programme', programmeSchema);

export default Programme;
