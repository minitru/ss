import mongoose from 'mongoose';

// CODES WE SEND OUT
// EITHER INVITES OR GIFTS
// AND WHO SENT THEM
const codeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    codetype: {type: Number, required: true},
    code: { type: Number, unique: true, required: true },
    expires: { type: Date, default: new Date(+new Date() + 2*24*60*60*1000), required: true },
  }
);

const codeModel = mongoose.model('Code', codeSchema);

export default codeModel;
