require("dotenv").config();

const jwt = require("jsonwebtoken");

// Middleware function to authenticate the token
const authenticateToken = (req, res, next) => {
  try {
    // Retrieve the token from the request headers
    const token = req.cookies["access_token"];
    // console.log("Token is ", token); // debug

    if (!token) {
      // Token not provided, return unauthorized
      return res.sendStatus(401);
    }

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // Token verification failed, return forbidden

        return res.sendStatus(403);
      }
      // console.log("Password verified!"); //debug
      // Token is valid, set the userId on the request object, this ayload userId is being signed while login
      req.userId = payload.userId;
      req.role = payload.userRole;
      next();
    });
  } catch (error) {
    // Error occurred, return internal server error
    res.sendStatus(403);
  }
};

// const authenticateToken = (req, res, next) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return res.sendStatus(403);
//   }
//   try {
//     const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.userId = data.id;
//     req.userRole = data.role;
//     return next();
//   } catch {
//     return res.sendStatus(403);
//   }
// };

// Export the middleware function
module.exports = authenticateToken;
