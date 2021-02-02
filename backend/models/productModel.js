import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// FAVS ARE FAVORITE TYPES OF SHOUTS
// birthdays anniversaries motivational advice support AMAs
const favsSchema = new mongoose.Schema({
	name: { type: String, default: "shoutouts", required: true },
});

const groupSchema = new mongoose.Schema({
    name: { type: String, default: "starshout", required: true },
});

const productSchema = new mongoose.Schema({
  group: [groupSchema],
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  desc: { type: String, required: false },
  intro: { type: String, required: false },
  tags: { type: String, required: false },
  favs: [favsSchema],
  rating: { type: Number, default: 0, required: true },
  numReviews: { type: Number, default: 0, required: true },
  reviews: [reviewSchema],
});

const productModel = mongoose.model('Product', productSchema);

export default productModel;
