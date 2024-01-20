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
  commission_balance: { type: Number, required: true },
  // kyc releted
  kyc_status:{type:Boolean,required:true},
  kyc_status_msg:{type:String,required:true},
  kyc_upload:{type:Boolean,required:true},
  kyc:{type:mongoose.Types.ObjectId, ref:model_names_obj.kyc},//kyc model id
  //reffral releted
  is_referral_exist:{type:Boolean,required:true},
  referral_by_user:{type:mongoose.Types.ObjectId,ref:model_names_obj.user},
// if course/plan is enrolled these will get updated
  is_enrolled:{type:Boolean,required:true},
  enrolled_plan:{type:mongoose.Types.ObjectId,ref:model_names_obj.plans},
  // it will be payment_junction which record all details
  payments_details_junction:{type:mongoose.Types.ObjectId,ref:model_names_obj.payment_details}
},{timestamps: true});

const userModel = mongoose.model(model_names_obj.user, userSchema);

module.exports = userModel;

