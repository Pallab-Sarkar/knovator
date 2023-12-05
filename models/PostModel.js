const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: Number,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], //[long, lat]
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

PostSchema.index({ geoLocation: "2dsphere" });

module.exports = mongoose.model("PostModel", PostSchema, "posts");
