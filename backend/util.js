import jwt from 'jsonwebtoken';
import config from './config';
import User from './models/userModel'
require('dotenv').config()

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
  console.log("HEADERS " + JSON.stringify(req.headers));

  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        console.log("INVALID TOKEN RET 401");
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.user = decode;
      console.log("USER: " + JSON.stringify(req.user));
      next();
      return;
    });
  } else {
    console.log("TOKEN NOT SUPPLIED RET 401");
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

const sendSms = (userfrom, userTo, phone) => {
    const accountSid = process.env.API_SID;
    const authToken = process.env.API_TOKEN;
    console.log("TWILIO ENV " + accountSid + " " + authToken);
    const client = require('twilio')(accountSid, authToken);

    console.log("CALLING TWILIO " + userfrom + " " + phone);

    client.messages
    .create({
        body: 'Hi ' + userTo + '! ' + userfrom + ' has just invited you to Starshout. Get the app here: http://starshout.net',
        from: '+14242874688',   // 424-CU-SHOUT
        to: phone
    })
    .then(message => console.log(message.sid));
}

export { getToken, isAuth, isAdmin, sendSms };
