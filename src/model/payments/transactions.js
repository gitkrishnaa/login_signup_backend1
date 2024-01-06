const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");


// order_id is required because it always generated
// if payments signature exist mean transction is sucessful
const schema=mongoose.Schema({
user:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},
plan:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.plans},
status:{type:Boolean,required:true},
status_msg:{type:String,required:true},    
order_id:{type:String},
payment_id:{type:String},
payment_signature:{type:String},
captured:{type:Boolean}

},{ timestamps: true })
const model = mongoose.model(model_names_obj.transactions,schema );
module.exports = model;