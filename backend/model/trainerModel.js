import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  socialMediaLink: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  description: {
    type: String,
    required: true,
  },
  programmes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;
