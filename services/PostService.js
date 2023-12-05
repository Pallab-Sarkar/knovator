const PostModel = require("../models/PostModel.js");
const constant = require("../config/constants");

module.exports.create = async function (req, data) {
  return new Promise(async (resolve, reject) => {
    if (!req.user) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.UNAUTHORIZED,
        message: "Unauthorized !",
      });
    }

    if (!data) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
        message: "Invalid Data !",
      });
    }

    if (!data.title) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
        message: "Please enter title !",
      });
    }

    if (!data.body) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
        message: "Please enter post body !",
      });
    }

    data.createdBy = req.user._id;

    let findPost = await PostModel.getOne({
      createdBy: req.user._id,
      title: data.title,
    });
    if (findPost) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.UNAUTHORIZED,
        message: "You already created a post with same title !!",
      });
    }

    try {
      const result = await PostModel.create(data);
      if (!result) {
        reject({ message: "Post could not be created" });
      }

      resolve(result);
    } catch (error) {
      reject({ message: error });
    }
  });
};

module.exports.getAllList = async (req, bodyData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let condition = bodyData.conditions ? bodyData.conditions : {};

      let limit = 0;
      let skip;
      let page;
      let pagination = bodyData.pagination;
      if (pagination) {
        limit = isNaN(Number(pagination.limit)) ? 10 : Number(pagination.limit);
        page = Number(pagination.page) || 1;
        skip = pagination.page ? pagination.limit * (pagination.page - 1) : 0;
      } else {
        limit = 0;
        skip = 0;
      }

      if (req.body.searchTerm) {
        const searchTerm = req.body.searchTerm;
        const regex = new RegExp(searchTerm, "i");
        condition.$or = [{ title: regex }, { body: regex }];
      }

      //Only get particular user's Post
      condition.createdBy = req.user._id;

      //Location based search
      if (condition.geoLocation) {
        let loc = {
          type: "Point",
          coordinates: [condition.location.long, condition.location.lat],
        };
        companyData.geoLocation = loc;
      }

      let reviews = await PostModel.find(condition)
        .limit(limit)
        .skip(skip)
        .sort(req.body.sort ?? { updatedAt: -1 });

      resolve(reviews);
    } catch (error) {
      console.log("error while fetching all review:--", error.message);
      reject({ message: error.message });
    }
  });
};

module.exports.getById = async function (req, params) {
  return new Promise(async (resolve, reject) => {
    const _id = params.id;
    let condition = {};

    //Location based search
    if (req.query.long && req.query.lat) {
      let loc = {
        type: "Point",
        coordinates: [req.query.long, req.query.lat],
      };
      condition.geoLocation = loc;
    }

    condition._id = _id;
    condition.createdBy = req.user._id;

    try {
      const getPost = await PostModel.findOne(condition);
      if (getPost) {
        resolve(getPost);
      } else {
        reject({ message: "Post not found", status: 404 });
      }
    } catch (error) {
      reject({ message: error });
    }
  });
};

module.exports.update = async function (req, updateFields) {
  return new Promise(async (resolve, reject) => {
    if (!(req.params && req.params.id)) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
        message: "Invalid post ID !!",
      });
    }
    if (!updateFields) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
        message: "Invalid Data !!",
      });
    }
    if (!req.user) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.UNAUTHORIZED,
        message: "Unauthorized !!",
      });
    }

    const getPost = await PostModel.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!getPost) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
        message: "Post does not exist !!",
      });
    }

    if (updateFields._id) {
      delete updateFields._id;
    }

    try {
      const update = await PostModel.updateOne(
        { _id: req.params.id, createdBy: req.user._id },
        updateFields
      );
      if (!update || update.modifiedCount !== 1) {
        return reject({
          status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
          message: "Unable to update post!!",
        });
      }

      resolve(update);
    } catch (error) {
      reject({ message: error });
    }
  });
};

module.exports.delete = async function (req) {
  return new Promise(async (resolve, reject) => {
    if (!(req.params && req.params.id)) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
        message: "Invalid post ID !!",
      });
    }
    if (!req.user) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.UNAUTHORIZED,
        message: "Unauthorized !!",
      });
    }
    const authUser = req.user;

    const getPost = await PostModel.findOne({
      _id: req.params.id,
      createdBy: authUser._id,
    });
    if (!getPost) {
      return reject({
        status: constant.constants.HTML_STATUS_CODE.NOT_FOUND,
        message: "Invalid post !!",
      });
    }

    try {
      const res = await PostModel.deleteOne({
        _id: req.params.id,
        createdBy: authUser._id,
      });
      if (res.deletedCount == 0) {
        return reject({
          status: constant.constants.HTML_STATUS_CODE.INVALID_DATA,
          message: "Unable to delete post!!",
        });
      }

      resolve(res);
    } catch (error) {
      reject({ message: error });
    }
  });
};
