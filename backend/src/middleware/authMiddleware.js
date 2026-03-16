const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log(`Auth failed: No token provided for ${req.url}`);
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.id;
    next();
  } catch (error) {
    console.log(`Auth failed: ${error.message} for token: ${req.headers.authorization?.substring(0, 20)}...`);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
