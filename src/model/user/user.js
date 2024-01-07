const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

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
  // kyc releted
  kyc_status:{type:Boolean,required:true},
  kyc_status_msg:{type:String,required:true},
  kyc_details:{type:mongoose.Types.ObjectId, ref:model_names_obj.kyc},
  //reffral releted
  is_referral_exist:{type:Boolean,required:true},
  referral_by_user:{type:mongoose.Types.ObjectId,ref:model_names_obj.user,},

  // referral_by_code:{type:String,required:true}

});

const userModel = mongoose.model(model_names_obj.user, userSchema);

module.exports = userModel;

