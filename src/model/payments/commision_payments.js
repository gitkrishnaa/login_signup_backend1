const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { model_names_obj } = require("../Model_obj");

//schema
// note, here user_id mean reffral_id who recieve the commission
/*
reffral_user_id-the user who recieve the commision, or user that reffral code used in purchase of course by that other user
payments_id- all detais, like junction
paid- if amount added in reffral user then update it to true

*/

const userSchema = mongoose.Schema({
reffral_user_id:{required:true,type:mongoose.Types.ObjectId,ref:"user"},
payments_id:{required:true,type:mongoose.Types.ObjectId,ref:"user"},
paid:{required:true,type:Boolean},



});

const userModel = mongoose.model(model_names_obj.commision_payments, userSchema);

module.exports = userModel;

