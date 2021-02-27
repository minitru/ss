import express from 'express';
import Work from '../models/workModel';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

// SMM: NOT SURE IF THIS WILL WORK FOR US
// LEAVING IT IN FOR NOW
// router.get("/", isAuth, async (req, res) => {
router.get("/", async (req, res) => {
  const works = await Work.find({ id: "yDcCewXbdyfvZSjXYW2OhtUtss03"});
  console.log("FIND WORK FOR " + req.body.id);
  //const works = await Work.find({}).populate('id' );
  res.send(works);
});
router.get("/mine/:id", async (req, res) => {
  const works = await Work.find({ id: req.params.id });
  console.log("FIND MY WORK FOR " + req.params.id);
  res.send(works);
});

//router.get("/:orderId", isAuth, async (req, res) => {
router.get("/:orderId", async (req, res) => {
  const work = await Work.findOne({ orderId: req.params.orderId });
  console.log("FIND JOB FOR " + req.params.id);
  if (work) {
    res.send(work);
  } else {
    res.status(404).send("Work Not Found.")
  }
});

router.delete("/:orderId", isAuth, isAdmin, async (req, res) => {
  const work = await Work.findOne({ orderId: req.params.orderId });
  if (work) {
    const deletedWork = await work.remove();
    res.send(deletedWork);
  } else {
    res.status(404).send("Work Not Found.")
  }
});

// router.post("/", isAuth, async (req, res) => {
// LOSE isauth FOR TESTING HERE
router.post("/", async (req, res) => {
    console.log("GOT REQ: " +req.body.id);

// NEED TO ADD APPROVER IN HERE SOMEWHERE
// OR IT'S ADDED LATER - WHEN NEEDED
  const newWork = new Work({
    id: req.body.id,
    orderId: req.body.orderId,
    orderStatus: req.body.orderStatus,
    orderPrice: req.body.orderPrice,
    orderDate: req.body.orderDate,
    orderDuedate: req.body.orderDuedate,
    orderFrom: req.body.orderFrom,
    orderTo: req.body.orderTo,
    orderType: req.body.orderType,
    orderInfo: req.body.orderInfo,
    personalmsg: req.body.personalmsg,
    onscreendesc: req.body.onscreendesc,
    imgfile: req.body.imgfile,
    ovfile: req.body.ovfile,
    secondvideo: req.body.secondvideo,
  });
  const newWorkCreated = await newWork.save();
  res.status(201).send({ message: "New Work Created", data: newWorkCreated });
});

// SMM NICE MODEL TO HANDLE STATE CHANGES
// LIKE AUTH A NEW JOB, APPROVE, ETC
// STATUS CAN BE
// unpaid | auth | active | deny | post | qa | delivered
router.put("/:orderId/auth", isAuth, async (req, res) => {
  const work = await Work.findOne(req.params.orderId);
  if (work) {
    orderStatus: 'active';
    const updatedWork = await work.save();
    res.send({ message: 'Work Authorized.', work: updatedWork });
  } else {
    res.status(404).send({ message: 'Work not found.' })
  }
});

export default router;
