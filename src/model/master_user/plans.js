const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");


const schema=mongoose.Schema({
plan_name:{required:true,type:String,unique:true},
price:{required:true,type:String},
active:{required:true,type:String},
commision_percentage:{required:true,type:String},
referral_code:{required:true,type:String,unique:true},
gst:{type:Number},
is_discount:{type:Boolean},
discount:{type:mongoose.Types.ObjectId,ref:model_names_obj.discount,},
plan_contents:{type:mongoose.Types.ObjectId,ref:model_names_obj.plan_contents,},
})
const model = mongoose.model(model_names_obj.plans, schema);

module.exports = model;