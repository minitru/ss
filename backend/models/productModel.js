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
  id: { type: String, required: true },

  // PROFILE SCREEN FORM
  stageName: { type: String, required: true },
  headshot: { type: String, required: false },
  promoAboutme: { type: String, default: "Tell us about yourself", required: true },
  shoutPrice: { type: Number, default: 5.01, required: true },
  shoutTags: { type: String, default: "comedy, relationships", required: true },
  shoutFavs: { type: String, default: "shoutouts", required: true },
  // THIS MAY BE PART OF A STARSHOUT PROMO JOB...
  promoVideo: { type: String, required: false },
  promoVideoCaption: { type: String, default: "Order a Starshout from me!", required: true },
  shoutPerformance: { type: String, required: false },

  rating: { type: Number, default: 0, required: true },
  numReviews: { type: Number, default: 0, required: true },
  reviews: [reviewSchema],
});

const productModel = mongoose.model('Product', productSchema);

export default productModel;
