const mongoose = require("mongoose");


// amount-the amount without gst



const schema=mongoose.Schema({
    amount_without_gst:{required:true,type:Number},
    gst_percentage:{required:true,type:Number},
    razorpay_charges_percentage:{required:true,type:Number},
    razorpay_charges_amount:{type:Number},
    commission_sales_value_csv:{required:true,type:Number},
    reffral_commission_percentage:{required:true,type:Number},
    reffral_commission_amount:{type:Number},

})
const model = mongoose.model("user",schema );
module.exports = model;