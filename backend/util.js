import jwt from 'jsonwebtoken';
import config from './config';
import User from './models/userModel'

var admin = require("firebase-admin");

var serviceAccount = require("/home/sean/.ssh/star-166ac-firebase-adminsdk-mavao-98b7608a78.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://star-166ac-default-rtdb.firebaseio.com"
});


const googleAuth = (req, res) => {
   console.log("CALLING GOOGLEAUTH " + req.body.email + " " + req.body.googleid);
   const id = admin.auth().verifyIdToken(req.body.googletoken.i)
  .then((decodedToken) => {
	console.log("TOKEN DECODED OK " + JSON.stringify(decodedToken));
    if (req.body.googleid == decodedToken.uid) {
        console.log("USER AUTHED - RETURNING: " + id);
        return
     }
	 else {
		console.log("USER FAILED VERIFY");
        return res.status(401).send({ message: 'Token is invalid.' });
	 }
  	});
}

const getToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    config.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
};

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.user = decode;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: 'Token is not supplied.' });
  }
};

const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).send({ message: 'Admin Token is not valid.' });
};

export { googleAuth, getToken, isAuth, isAdmin };
