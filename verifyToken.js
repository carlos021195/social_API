const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
    const bearerHeader = req.header('authorization');
  
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      try {
        jwt.verify(bearerToken, process.env.SECRET_KEY);
        next();
      }
      catch (err) {
          res.sendStatus(403);
      }
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }

  module.exports = {verifyToken}
