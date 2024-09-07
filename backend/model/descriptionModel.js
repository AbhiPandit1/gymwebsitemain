import mongoose from 'mongoose';

// Define the Description schema as a separate schema
const descriptionSchema = new mongoose.Schema({
  paragraphs: [
    {
      type: String,
      required: true,
    },
  ],
  image: {
    public_id: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  },
});

// Create and export the Description model
const Description = mongoose.model('Description', descriptionSchema);

export default Description;
