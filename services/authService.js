const UserModel = require("../models/UserModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
let saltRounds = 10;
const { prepareUserResponse: prepareUserRes1 } = require("../utils/utils.js");
const { constants } = require("../config/constants.js");

//Register or Create user
module.exports.addUser = async (req, userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userData.firstName || !userData.lastName) {
        return reject({
          message: "Please enter first name and last name !!",
          status: constants.HTML_STATUS_CODE.INVALID_DATA,
        });
      }

      if (!userData.email || !userData.password) {
        return reject({
          message: "Invalid payload !!",
          status: constants.HTML_STATUS_CODE.INVALID_DATA,
        });
      }

      if (userData.email) {
        const checkIfUserEmailAlreadyExist = await UserModel.findOne({
          email: userData.email,
        });
        if (checkIfUserEmailAlreadyExist) {
          return reject({
            message: "User already exist with same Email id.",
            status: constants.HTML_STATUS_CODE.CONFLICT,
          });
        }
      }

      var user = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase().trim(),
        role: userData.role,
        password: userData.password,
      };

      var condition = {};
      condition.email = user.email;

      let existingUser = await UserModel.findOne(condition);

      if (!existingUser) {
        if (user.password.length <= 5) {
          reject({ message: "Password should be greater than 6 characters" });
        } else if (user.password) {
          var hashedPassword = await bcrypt.hash(user.password, saltRounds);
          user.password = hashedPassword;
        }

        let result = await UserModel.create(user);

        if (!result) {
          reject({ message: "User creation failed!" });
        }

        resolve(prepareUserRes1(result));
      } else {
        reject({ message: "User already exists" });
      }
    } catch (error) {
      console.log("error while adding user:--", error.message);
      reject({ message: error.message });
    }
  });
};

//Login
module.exports.authenticate = async (req, userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userData.email || !userData.password) {
        reject({
          message: "Invalid payload !!",
          status: constants.HTML_STATUS_CODE.INVALID_DATA,
        });
      }
      let condition = {};

      condition.email = userData.email;
      let user = await UserModel.findOne(condition);
      if (!user) {
        reject({ message: "User not found", status: 404 });
      } else {
        let updateFields = {};
        let passwordMatch = bcrypt.compare(userData.password, user.password);

        if (passwordMatch) {
          let token = jwt.sign({ _id: user._id }, config.development.secret, {
            expiresIn: 7889238,
          });

          await UserModel.findOneAndUpdate(
            { _id: user._id },
            { $set: updateFields }
          );
          resolve({ token: "Bearer " + token, ...prepareUserRes1(user) });
        } else {
          reject({ message: "Invalid credentials!" });
        }
      }
    } catch (error) {
      console.log("error while authenticating user:--", error.stack);
      reject({ message: "Internal server error while logging in." });
    }
  });
};
