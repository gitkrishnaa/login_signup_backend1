const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

// not - it is useing as juction, and it also record all user plan purchages


// amount-the amount without gst



const schema=mongoose.Schema({
    original_plan_price:{required:true,type:Number},
    final_plan_price:{required:true,type:Number},//it means price after all discount
    gst_percentage:{required:true,type:Number},
    TDS_percentage:{required:true,type:Number},
    payment_platform_charges_percentage:{required:true,type:Number},
    
    commission_sales_value_csv:{required:true,type:Number},
    
    // // if referral 
    // is_referral:{required:true,type:Boolean},
    // reffral_commission_percentage:{type:Number},
    is_referral_commission_eligible:{required:true,type:Boolean},
    // is discount
    is_discount:{required:true,type:Boolean},
    discount_percentage:{type:Number},

    // is discount
    is_coupon:{required:true,type:Boolean},
    coupon_details:{type:Object},

    // discount by admin when manual cash purchase
    is_admin_discount:{required:true,type:Boolean},
    admin_discount_percentage:{type:Number},

   //is upgraded ,mean- if user already purchased any plan and now want to buy another higher plan(user not able to buy lower)
   is_upgraded:{required:true,type:Boolean},
   previous_purchased_plan_csv:{type:Number},
 

    // calculations
    discount_calc_details:{type:Object,required:true},
    all_calculations:{type:Object,required:true},

    // developer_msg
     developer_msg:{type:String}
},{ timestamps: true })
const model = mongoose.model(model_names_obj.purchase_details,schema );
module.exports = model;