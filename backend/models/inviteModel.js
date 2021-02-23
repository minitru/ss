import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const inviteModel = mongoose.model('Invite', inviteSchema);

export default inviteModel;
