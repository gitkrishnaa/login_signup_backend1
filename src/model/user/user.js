const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//schema

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: {type: String,unique: true,required: true},
  user_referral_code: {type: String,unique: true,required: true},
  mobile: {type: String,required: true},
  verified: { type: Boolean, required: true},
  active: { type: Boolean, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: Number, required: true },
  amount: { type: Number, required: true },
  kyc_status:{type:Boolean},
  kyc_details:{  type:mongoose.Types.ObjectId, ref:"kyc"},
  referral_by_id:{type:mongoose.Types.ObjectId,ref:"user",},
  referral_by_code:{type:String,required:true}

});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

