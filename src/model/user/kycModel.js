const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { model_names_obj } = require("../Model_obj");
//schema

const Schema = mongoose.Schema({
    user_id:{type:mongoose.Types.ObjectId,required:true, ref:model_names_obj.user},
    name:{type:String,required:true},
    adhar_card:{type:String,required:true},
    adress:{type:String,required:true},
    uploaded_doc:{type:String,required:true},
    pan_card:{required:true,type:String},
    bank_account_details:{
     bank_name:{required:true,type:String},
     account_number:{required:true,type:String},
     ifsc_code:{required:true,type:String},
    },
   
});

const Model = mongoose.model(model_names_obj.kyc, Schema);

module.exports = Model;

