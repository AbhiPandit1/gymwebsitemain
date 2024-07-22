import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  socialMediaLink: {
    facebook: {
      type: String,
      // You can optionally add a validator here if needed
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
    instagram: {
      type: String,
      // You can optionally add a validator here if needed
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
    linkedin: {
      type: String,
      // You can optionally add a validator here if needed
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
      default: '',
    },
  },
  description: {
    type: String,
    default: '',
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
