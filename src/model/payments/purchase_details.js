const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

// not - it is useing as juction, and it also record all user plan purchages


// amount-the amount without gst



const schema=mongoose.Schema({
    amount_without_gst:{required:true,type:Number},
    gst_percentage:{required:true,type:Number},
    TDS_percentage:{required:true,type:Number},
    payment_platform_charges_percentage:{required:true,type:Number},
    payment_platform_amount:{type:Number},
    commission_sales_value_csv:{required:true,type:Number},
    reffral_commission_percentage:{required:true,type:Number},
    reffral_commission_amount:{type:Number},
    
})
const model = mongoose.model(model_names_obj.payment_calculations,schema );
module.exports = model;