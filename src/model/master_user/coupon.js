const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");
model_names_obj
const schema=mongoose.Schema({
active:{type:Boolean,required:true},
name:{type:String,required:true},
coupon_code:{type:String,required:true,unique:true},
details:{type:String},//that can show to user
discount_percentage:{type:Number,required:true},
expire_date:{type:Date,required:true},
deleted:{type:Boolean,required:true}

},{ timestamps: true })
const model = mongoose.model(model_names_obj.coupon_model,schema );
module.exports = model;