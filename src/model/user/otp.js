const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

const schema=mongoose.Schema(
  {email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otp_used: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 20, // The document will be automatically deleted after 5 minutes of its creation time
  }})
const model = mongoose.model(model_names_obj.otp,schema );
module.exports = model;