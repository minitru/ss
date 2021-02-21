import jwt from 'jsonwebtoken';
import config from './config';
import User from './models/userModel'

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

export { getToken, isAuth, isAdmin };
