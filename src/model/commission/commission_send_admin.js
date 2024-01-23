const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");


// all withraw req amount send by admin will be record there that amount is sent or not 

// one withrow req can have only one settlement, it can be edited by admin if transction status will be false,
// why this- because may be tranction fail, or user account is wrong then admin can tell user that update kyc, in which bank account will be updated


const schema=mongoose.Schema({
commission_withdraw_req:{required:true,unique:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},

transction_status:{required:true,type:Boolean},
bank_transction_no:{required:true,type:String},

admin_msg:{type:String},
is_msg_display:{required:true,type:Boolean},
admin_notes:{type:String},
admin_user:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},

},{ timestamps: true })
const model = mongoose.model(model_names_obj.commission_send_admin,schema );
module.exports = model;