const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//schema

const Schema = mongoose.Schema({

    name:{type:String,required:true},
    email:{type:String,required:true},
    date_of_birth:{type:String,required:true},
    state:{type:String,required:true},
    mobile:{type:String,required:true},
    gender:{type:String,required:true},
    aadhaar_aumber:{type:String,required:true},
    bank_account_details:{
     bank_name:{required:true,type:String},
     Account_number:{required:true,type:String},
     ifsc_code:{required:true,type:String},
     Account_name:{required:true,type:String},
    },
    country:{type:String,required:true},
    pan_card_details:{
        pan_card_number:{required:true,type:String},
        name:{required:false,type:String},
       },
});

const Model = mongoose.model("kyc", Schema);

module.exports = Model;

