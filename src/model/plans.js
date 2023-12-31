const mongoose = require("mongoose");


const schema=mongoose.Schema({
plan_name:{required:true,type:String,unique:true},
price:{required:true,type:String},
active:{required:true,type:String},
commision_percentage:{required:true,type:String},
referral_id:{required:true,type:String,unique:true},
discount_percentage:{type:Number},
})
const model = mongoose.model("plans", schema);

module.exports = model;