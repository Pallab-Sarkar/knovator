const express = require("express");
const router = express.Router();
const PostService = require("../services/PostService.js");
const { handleError } = require("../utils/utils.js");
const isAuthenticate = require("../services/tokenService.js");

router.post("/create", isAuthenticate, (req, res) => {
  PostService.create(req, req.body)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "post created successfully",
        data: result,
      });
    })
    .catch(handleError(res));
});

router.post("/getAll", isAuthenticate, (req, res) => {
  PostService.getAllList(req, req.body)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "List fetched successfully",
        data: result,
      });
    })
    .catch(handleError(res));
});

router.get("/:id", (req, res) => {
  PostService.getById(req, req.params)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Single post fetched successfully",
        data: result,
      });
    })
    .catch(handleError(res));
});

router.put("/:id", isAuthenticate, (req, res) => {
  PostService.update(req, req.body)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: result,
      });
    })
    .catch(handleError(res));
});

router.delete("/:id", isAuthenticate, (req, res) => {
  PostService.delete(req)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "post deleted successfully",
        data: result,
      });
    })
    .catch(handleError(res));
});

module.exports = router;
