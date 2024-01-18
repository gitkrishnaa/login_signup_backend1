const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");
model_names_obj
const schema=mongoose.Schema({
is_active:{type:Boolean,required:true},
name:{type:String,required:true},
details:{type:String,required:true},
discount_msg:{type:String,required:true},//that can show to user

//there is two value Number or percentage
discount_percentage:{type:Number,required:true}
},{timestamps: true})
const model = mongoose.model(model_names_obj.discount,schema );
module.exports = model;