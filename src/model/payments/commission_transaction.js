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

// logic
/*
each commission have two entry




*/


const userSchema = mongoose.Schema({
payments_junction:{type:mongoose.Types.ObjectId,ref:model_names_obj.payment_details},
commission_receiver_user:{required:true,type:mongoose.Types.ObjectId,ref:model_names_obj.user},
commission_amount:{required:true,type:Number},
// on which date, user will recive or admin will send  money to user
date_of_payment:{required:true,type:Date},
amount_sent_status:{required:true,type:Boolean},
msg:{type:String},
note:{type:String},
// for tranction details
transfer_details:{type:String},
// half commission will be added instant and half will be added after 7 days using cron jobs

},{ timestamps: true });

const userModel = mongoose.model(model_names_obj.commission_payments, userSchema);

module.exports = userModel;

