import express from 'express';
import User from '../models/userModel';
import Product from '../models/productModel';
import { getToken, isAuth, googleAuth } from '../util';

var admin = require("firebase-admin");

var serviceAccount = require("/home/sean/.ssh/star-166ac-firebase-adminsdk-mavao-98b7608a78.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://star-166ac-default-rtdb.firebaseio.com"
});

const router = express.Router();

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

router.post('/signin', async (req, res) => {
  const signinUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (signinUser) {
    res.send({
      _id: signinUser.id,
      name: signinUser.name,
      email: signinUser.email,
      isAdmin: signinUser.isAdmin,
      token: getToken(signinUser),
    });
  } else {
    res.status(401).send({ message: 'Invalid Email or Password.' });
  }
});

router.post('/tokenlogin', async (req, res) => {
    const signinUser = await User.findOne({
        email: req.body.email,
        id: req.body.googleid,
    }); 

    const decodedToken = await admin.auth().verifyIdToken(req.body.googletoken.i)
    if (decodedToken) {
        console.log("TOKEN DECODED OK " + JSON.stringify(decodedToken));
    }
    else {
        console.log("TOKEN DECODE FAILED");
    }
    // VERIFY THE TOKEN HERE
    if (req.body.googleid == decodedToken.user_id) {
        console.log("USER AUTHED OK");
     }
     else {
        console.log("USER FAILED VERIFY");
        return res.status(401).send({ message: 'Token is invalid.' });
     }

     if (signinUser) {
        console.log("LOGIN EXISTING " + req.body.email);
        res.send({
            id: signinUser.id,
            name: decodedToken.name || req.body.name,
            email: decodedToken.email,
            profile_photo: decodedToken.picture,
            token: getToken(signinUser),
            isAdmin: signinUser.isAdmin,
        });
    } else {    // REGISTER AUTOMATICALLY
	    console.log("AUTOREGISTER USER " + req.body.name);
        const user = new User({
            id: req.body.googleid,
            name: decodedToken.name || req.body.name,
            email: decodedToken.email,
            profile_photo: decodedToken.picture,
            password: "unused",  // PASSWORDS ARE IN GOOGLE
        });

        const product = new Product({
            id: req.body.googleid,
            stageName: decodedToken.name || req.body.name,
            headshot: decodedToken.picture,
        });
        const newProd = await product.save();

        const newUser = await user.save();
        if (newUser) {
            res.send({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                profile_photo: decodedToken.picture,
                isAdmin: newUser.isAdmin,
                token: getToken(newUser),
            });
        }
    } 
});

router.post('/register', async (req, res) => {
  console.log("CALLING REGISTER " + req.body.name);
  const user = new User({
       id: req.body.googleid,
       name: req.body.name,
       email: req.body.email,
       password: req.body.password || "unused",
  });
  
  const newUser = await user.save();
  if (newUser) {
    res.send({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: getToken(newUser),
    });
  } else {
    console.log("REGISTERING ERROR!");
    res.status(401).send({ message: 'Invalid User Data.' });
  }
});

router.get('/createadmin', async (req, res) => {
  try {
    const user = new User({
      name: 'Sean',
      email: 'sean@maclawran.ca',
      password: 'doodoo',
      isAdmin: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});

export default router;
