import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, index: true, dropDups: true,
  },
  phone: { type: String, unique: true, required: false },
  profile_photo: { type: String, required: false },
  password: { type: String, required: true },
  sponsor: { type: String, default: "sean", required: true },
  shoutDate: {type: Date, required: true, default: Date.now},
  isAdmin: { type: Boolean, required: true, default: false },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
