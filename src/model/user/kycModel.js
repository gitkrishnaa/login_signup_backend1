const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//schema

const Schema = mongoose.Schema({
    name:{type:String,required:true},
    aadhaar_card:{type:String,required:true},
    bank_account_details:{
     bank_name:{required:true,type:String},
     Account_number:{required:true,type:String},
     ifsc_code:{required:true,type:String},
     Account_name:{required:true,type:String},
    },
    pan_card:{required:true,type:String},
    bank_account_verified:{
        status:{required:true,type:Boolean},
        msg:{required:true,type:String},

    }

});

const Model = mongoose.model("kyc", Schema);

module.exports = Model;

