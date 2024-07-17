import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  programmes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Programme',
    },
  ],
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
