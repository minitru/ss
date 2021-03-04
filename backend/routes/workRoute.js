import express from 'express';
import Work from '../models/workModel';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

// NEED TO ADD RESTRICTION ON TYPE != "active"

// router.put("/:orderId/auth", isAuth, isAdmin, async (req, res) => {
// REMEMBER TO SEND TYPE JSON
// req.params ARE IN THE COMMAND LINE, req.body IS THE JSON
router.put("/:orderId/auth", async (req, res) => {
  console.log("AUTH PUT" + req.params.orderId);
  console.log("USERID " + req.body.id + " " + req.body.auth);

  // IF IT'S AN AUTH AND IT'S THE TALENT, THEN THE STATUS GOES RIGHT TO
  // ACTIVE. IF IT'S THEIR SPONSOR, IT GOES FROM preauth -> auth
  // I'M NOT SURE ABOUT THIS AT ALL
  const work = await Work.findOne({ orderId: req.params.orderId });
  if (work) {
    var newMessages = work.messages;
    var neworderStatus = work.orderStatus;
    if (req.body.auth == 'deny') { 
        console.log("DENY!");
        neworderStatus = 'deny';
    } else {
      if (work.orderStatus == 'preauth') {
        neworderStatus = 'auth';
      }
      if (work.orderStatus == 'auth') {
          neworderStatus = 'active';
      }
      if (work.orderStatus == 'qa') {
          neworderStatus = 'delivery';
      }
    }
    if (req.body.message) {
       newMessages.push(req.body.message);
    }

    const updateWork = await work.updateOne({orderStatus: neworderStatus, messages: newMessages});
    res.send(updateWork);
  } else {
    res.status(404).send("Work Not Found.")
  }
});

// NEED TO ADD RESTRICTION ON TYPE != "active"
router.get("/:id/auth", async (req, res) => {
// THIS FORMAT WORKS - NOW NEED TO INCLUDE WHAT STATUS TO GET
// STATUS = preauth | auth | QA
// FOR WORK IT'S STATUS = active (accepted)
  console.log("FIND MY WORK TO AUTH " + req.params.id);
  const works = await Work.find( { 
  $and: [ 
    // { $or: [ {approver: req.params.id} ] },  // WORKS FINE ALONE
    { $or: [ {id: req.params.id}, {approver: req.params.id} ] },
    { $or: [ {orderStatus: "preauth"}, {orderStatus: "auth"}, {orderStatus: "qa"} ] }
    ] });
  res.send(works);
});


// GET WORK FOR A USER
router.get("/:id/todo", async (req, res) => {
  // const works = await Work.find({ id: "yDcCewXbdyfvZSjXYW2OhtUtss03"});
  console.log("FIND TODOS FOR " + req.params.id);
  const works = await Work.find( { $and: [ { id: req.params.id}, {orderStatus: "active"} ] });
  res.send(works);
});

//router.get("/:orderId", isAuth, async (req, res) => {
router.get("/:orderId", async (req, res) => {
  console.log("FIND JOB FOR " + req.params.id);
  const work = await Work.findOne({ orderId: req.params.orderId });
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
// unpaid | preauth |  auth | active | deny | post | qa | delivered
router.get("/:orderId/auth/:yesno", isAuth, async (req, res) => {
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
