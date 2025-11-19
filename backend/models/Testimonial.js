import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Convert _id to id and remove _id and __v from JSON output
testimonialSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

