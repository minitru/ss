import jwt from 'jsonwebtoken';
import config from './config';

const googleAuth = (token) => {
	const {OAuth2Client} = require('google-auth-library');
	const client = new OAuth2Client("star-166ac");
	async function verify() {
  	const ticket = await client.verifyIdToken({
      	idToken: token,
      	audience: "star-166ac",  // Specify the CLIENT_ID of the app 
  	});
  	const payload = ticket.getPayload();A
  	console.log(JSON.stringify(payload));

  	const userid = payload['sub'];
  	// If request specified a G Suite domain:
  	// const domain = payload['hd'];
	}
	verify().catch(console.error);
	console.log("USER VERIFIED OK");
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

export { getToken, isAuth, isAdmin };
