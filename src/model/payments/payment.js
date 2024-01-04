const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

const schema=mongoose.Schema({
user_id:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},
reffral_user_id:{type:mongoose.Types.ObjectId,ref:model_names_obj.user},
transaction_id:{type:mongoose.Types.ObjectId,ref:model_names_obj.transactions},
plan_id:{type:mongoose.Types.ObjectId,ref:model_names_obj.plans},
commision_payments_id:{type:mongoose.Types.ObjectId,ref:model_names_obj.commision_payments},




})
const model = mongoose.model(model_names_obj.payment_details,schema);
module.exports = model;