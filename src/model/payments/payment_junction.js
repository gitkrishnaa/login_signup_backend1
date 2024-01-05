const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

// q-why plan and plan_contents in it, plan_contents is already in plans
// ans- plan_contents can be change in future, plan will only have new plan_contents, but user who buyed in past,does not now 
// what is happening, he will see updated plan contents, and that be diffrent then hwn he purchased, so we should aviod this problem 
// and shaw plan_contentans data of that time when he purchased the plan/course
// and if anything that will show to all past present user, that data will be in website frontend or  create new model

const schema=mongoose.Schema({
user_id:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},
reffral_user_id:{type:mongoose.Types.ObjectId,ref:model_names_obj.user},
transaction_id:{type:mongoose.Types.ObjectId,ref:model_names_obj.transactions},
plan_id:{type:mongoose.Types.ObjectId,ref:model_names_obj.plans},
// plan_contents:{type:mongoose.Types.ObjectId,ref:model_names_obj.plan_contents},
commision_payments_id:{type:mongoose.Types.ObjectId,ref:model_names_obj.commision_payments},
purchase_details:{type:mongoose.Types.ObjectId,ref:model_names_obj.purchase_details},
})
const model = mongoose.model(model_names_obj.payment_details,schema);
module.exports = model;