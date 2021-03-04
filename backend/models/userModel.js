import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  group: { type: String, required: true, default: "starshout" },
  country: { type: String, default: "US", required: true },
  lang: { type: String, default: "EN", required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, index: true, dropDups: true,
  },
  profile_photo: { type: String, required: false },
  city: { type: String, required: false },
  phone: { type: String, unique: false, required: false },
  password: { type: String, required: true },
  sponsor: { type: String, default: "yDcCewXbdyfvZSjXYW2OhtUtss03", required: true },
  startDate: {type: Date, required: true, default: Date.now},
  charity: { type: String, required: false },
  charitypct: { type: Number, required: false },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
