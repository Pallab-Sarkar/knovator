const constant = require("../config/constants.js");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel.js");
const config = require("../config/config.json");
const { prepareUserResponse: prepareUserRes1 } = require("../utils/utils.js");
const passport = require("passport");
const passportJWT = require("passport-jwt");

// Middleware to protect routes using JWT authentication
async function isAuthenticate(req, res, next) {
  try {
    // Configure the JWT strategy
    const JWTStrategy = passportJWT.Strategy;
    const ExtractJWT = passportJWT.ExtractJwt;

    passport.use(
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.development.secret,
        },
        (jwtPayload, done) => {
          // Check if the user exists
          const user = UserModel.findOne({ _id: jwtPayload.id });

          if (user) {
            return done(null, user);
          } else {
            return done(null, false, { message: "User not found" });
          }
        }
      )
    );

    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res
      .status(
        error.status || constant.constants.HTML_STATUS_CODE.INTERNAL_ERROR
      )
      .json(error);
  }
}

module.exports = isAuthenticate;
