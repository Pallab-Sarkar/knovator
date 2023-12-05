const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService.js");
const { handleError } = require("../utils/utils.js");

router.post("/login", (req, res) => {
  AuthService.authenticate(req, req.body)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Logged in Successfully",
        data: result,
      });
    })
    .catch(handleError(res));
});

router.post("/signup", (req, res) => {
  AuthService.addUser(req, req.body)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "User registered Successfully",
        data: result,
      });
    })
    .catch(handleError(res));
});

module.exports = router;
