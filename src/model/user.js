const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//schema

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: {type: String,unique: true,required: true},
  user_referral_id: {type: String,unique: true,required: true},
  mobile: {type: Number,required: true},
  verified: { type: Boolean, required: true},
  active: { type: Boolean, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: Number, required: true },
  amount: { type: Number, required: true },
  reffer_by:{
    type:mongoose.Types.ObjectId,
    ref:"user"
  }

});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

