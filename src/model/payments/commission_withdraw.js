const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

// why- for commision withdraw request and amount setterment
const schema=mongoose.Schema({
amount:{required:true,type:Number},
user_id:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},
// note-request datae will be timestamp
// it will be filled by master user

transction_status:{required:true,type:Boolean},
bank_transction_no:{required:true,type:String},
date_of_transction:{required:true,type:Date},
admin_msg:{type:String},
admin_message_display:{type:Boolean},
admin_notes:{type:String},
admin_user:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},


},{ timestamps: true })
const model = mongoose.model(model_names_obj.commission_withdraw,schema );
module.exports = model;