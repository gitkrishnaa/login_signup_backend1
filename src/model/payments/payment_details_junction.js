const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

// q-why plan and plan_contents in it, plan_contents is already in plans
// ans- plan_contents can be change in future, plan will only have new plan_contents, but user who buyed in past,does not now 
// what is happening, he will see updated plan contents, and that be diffrent then hwn he purchased, so we should aviod this problem 
// and shaw plan_contentans data of that time when he purchased the plan/course
// and if anything that will show to all past present user, that data will be in website frontend or  create new model

// this will have all id which releted to transaction
const schema=mongoose.Schema({
user:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},
plan:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.plans},
is_reffral_exist:{required:true,type:Boolean},
reffral_user:{type:mongoose.Types.ObjectId,ref:model_names_obj.user},
transaction:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.transactions},
// plan_contents:{type:mongoose.Types.ObjectId,ref:model_names_obj.plan_contents},

commision_payments_same_day:{type:mongoose.Types.ObjectId,ref:model_names_obj.commission_payments},
commision_payments_after_7day:{type:mongoose.Types.ObjectId,ref:model_names_obj.commission_payments},
purchase_details:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.purchase_details},

},{ timestamps: true })
const model = mongoose.model(model_names_obj.payment_details,schema);
module.exports = model;