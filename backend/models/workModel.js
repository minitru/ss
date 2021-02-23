import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: { type: String, default: "starshout", required: true },
});

const workSchema = new mongoose.Schema({
  group: [groupSchema],
  id: { type: String, required: true },
  approver: { type: String, default: "sean", required: true },

  orderId: { type: Number, unique: true, required: true },
  orderStatus: { type: String, required: true },
  orderPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  orderDuedate: { type: Date, required: false },
  orderFrom: { type: String, required: true },
  orderTo: { type: String, required: true },
  orderType: { type: String, required: false },
  orderInfo: { type: String, required: true },
  personalmsg: { type: String, required: false },
  onscreendesc: { type: String, required: false },
  imgfile: { type: String, required: false },
  ovfile: { type: String, required: false },
  secondVideo: { type: String, required: false }
});

const workModel = mongoose.model('Work', workSchema);

export default workModel;
