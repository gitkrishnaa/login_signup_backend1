const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

// why- for commision withdraw request ,
const schema=mongoose.Schema({
 withdraw_amount:{required:true,type:Number},
user_id:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},
transfer_status:{required:true,type:Boolean}
},{ timestamps: true })
const model = mongoose.model(model_names_obj.commission_withdraw_user,schema );
module.exports = model;