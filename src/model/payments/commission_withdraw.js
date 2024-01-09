const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

// why- for commision withdraw request and amount setterment
const schema=mongoose.Schema({
amount:{required:true,type:Number},
user_id:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},
// it will be filled by master user
notes:{type:String},
is_amount_send:{required:true,type:Boolean},
bank_transction_no:{required:true,type:Number},
date:{required:true,type:Date}

},{ timestamps: true })
const model = mongoose.model(model_names_obj.commission_withdraw,schema );
module.exports = model;