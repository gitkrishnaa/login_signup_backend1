const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

const schema=mongoose.Schema({
user_id:{required:true,type:mongoose.Types.ObjectId,ref:"user"},
reffral_user_id:{type:mongoose.Types.ObjectId,ref:"user"},
transaction_id:{type:mongoose.Types.ObjectId,ref:"user"},
plan_id:{type:mongoose.Types.ObjectId,ref:"user"},
commision_payments_id:{type:mongoose.Types.ObjectId,ref:"user"},




})
const model = mongoose.model(model_names_obj.payment_details,schema );
module.exports = model;