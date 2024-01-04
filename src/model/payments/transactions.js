const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

const schema=mongoose.Schema({
order_id:{type:String,required:true},
payment_id:{type:String},
payment_signature:{type:String},
status:{type:Boolean,required:true}

})
const model = mongoose.model(model_names_obj.transactions,schema );
module.exports = model;