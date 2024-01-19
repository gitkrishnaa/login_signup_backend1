require("dotenv").config();
const { model_names_obj } = require("../../model/Model_obj");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { is_empty, is_empty_variable } = require("../../utility/checks");
const UserModel = require("../../model/user/user");
const Plan_model = require("../../model/master_user/plans");
const Transaction_model = require("../../model/payments/transactions");
const Purchase_details_model = require("../../model/payments/purchase_details");
const Commision_tranaction = require("../../model/payments/commission_transaction");
const Coupon_model = require("../../model/master_user/coupon");

// payment junction - it used as junction for all model id which is releted to plan/course purchase
const Payment_junction = require("../../model/payments/payment_details_junction");
const { payment_calculations, plan_payment_calculation } = require("../../data/data");
const userModel = require("../../model/payments/commission_transaction");

const razorpay_key_id = process.env.RAZOPAY_KEY_ID;
const razorpay_key_secret = process.env.RAZOPAY_KEY_SECRET;


// it is shifted in data folder or in data calcuation forlder
// const plan_payment_calculation = (data) => {
//   // data:{
//   //   is_discount,
//   //   is_coupon,
//   //   discount_percentage,
//   //   coupon_discount_percentage,
//   //   plan_price
//   //   gst,
//   // }

//   const orignal_plan_price = data.price;
//   const is_discount = data.is_discount;
//   const is_coupon = data.is_coupon;
//   let final_plan_price = Number(orignal_plan_price);
//   const gst = data.gst;

//   let discount_percentage = null;
//   let coupon_discount_percentage = null;
//   let discount_value = null;
//   let coupon_discount_value = null;

//   if (is_discount == true) {
//     discount_percentage = data.discount_percentage;
//     discount_value = Number(final_plan_price * discount_percentage) / 100;
//     final_plan_price = final_plan_price - discount_value;
//   }
//   if (is_coupon == true) {
//     coupon_discount_percentage = data.coupon_discount_percentage;
//     coupon_discount_value =
//       Number(final_plan_price * coupon_discount_percentage) / 100;
//     final_plan_price = final_plan_price - coupon_discount_value;
//   }
//   const gst_value = Number(final_plan_price * gst) / 100;
//   const plan_price_without_gst = final_plan_price - gst_value;
//   return {
//     orignal_plan_price,
//     final_plan_price,
//     gst,
//     gst_value,
//     plan_price_without_gst,
//     is_discount,
//     is_coupon,
//     discount_percentage,
//     discount_value,
//     coupon_discount_percentage,
//     coupon_discount_value,
//   };
// };

const coupon_code_verification=async (coupon_code)=>{
  console.log("coupon_code_verification()")
  console.log(coupon_code)
  try {
    const compareDates = (d1, d2) => {
      let date1 = new Date(d1).getTime();
      let date2 = new Date(d2).getTime();
      console.log(date1,date2)
      if (date1 > date2) {
        return true;
      } else {
       return false;
      }
    }
    console.log("getting details of coupon")
    const coupon_detais =await Coupon_model.findOne({ coupon_code: coupon_code });
    console.log(coupon_detais)
  
    if(coupon_detais==null){
      return {is_valid:false,msg:"coupon not found"}
    }
    const expiry_date_status=compareDates(coupon_detais.expire_date,Date.now())
    console.log(expiry_date_status)
    if(coupon_detais.active==false){
      return {is_valid:false,msg:"coupon code is not active"}
    }
    else if(expiry_date_status==false){
      return {is_valid:false,msg:"coupon is expired"}
    }
    else if(coupon_detais.active==true && expiry_date_status==true && coupon_detais.deleted==false ){
      return {is_valid:true,msg:"coupon applied",coupon_detais}
    }
   else{
    return {is_valid:false,msg:"not found"}
   }
  } catch (error) {
    console.log(error)
  }


}


// for showing plan details and all calculation, it will be used in this controlled, it will be modified also
// note- this function will decide all the calculation , discount and coupon validation
// note- by using this we will handle "plan_and_payments_calc" route
const plan_and_payments_and_coupon_code_calc_function = async (plan_id,is_coupon,req) => {
  try {
    // note-only send plan_details that is not confidential like commission,meeting link , these not send in


    const plan_details = await Plan_model.findById(plan_id);
    // console.log(plan_details)
    const {
      meeting_link,
      commision_percentage,
      meeting_msg,
      ...plan_detalis_send
    } = plan_details._doc;

    const { active, price, is_discount, discount_percentage, gst } =
      plan_details._doc;
    // console.log(active);
    if (active === false) {
       // res.status(403).json({ msg: "plan is deactivated" });
      // return;
      return {status_code:403,status:false,msg:"plan is deactivated"}
    }

    // price cal
    const price_data_details = {
      is_discount,
      is_coupon: false,
      discount_percentage,
      coupon_discount_percentage: null,
      price,
      gst,
    };
    const price_detais = plan_payment_calculation(price_data_details);

// if coupon code
    if (is_coupon == true) {
      console.log("coupon code is exist")
      const coupon_code = req.body.payload.coupon_code;
       
     const coupon_code_status=await coupon_code_verification(coupon_code);
     if(coupon_code_status.is_valid==true){
      console.log("coupon code valid")
       const coupon_discount_percentage=coupon_code_status.coupon_detais?.discount_percentage;
       const price_data_details = {
        is_discount,
        is_coupon: true,
        discount_percentage,
        coupon_discount_percentage: coupon_discount_percentage,
        price,
        gst,
      };
      const price_detais = plan_payment_calculation(price_data_details);
      
      // res.status(200).json({msg: coupon_code_status.msg,plan_details: plan_detalis_send,price_details: price_detais,
      //   is_coupon_valid:true
      // });
      return {status_code:200,msg: coupon_code_status.msg,plan_details: plan_detalis_send,price_details: price_detais,
        is_coupon_valid:true
      }
     }
     else{
      console.log("coupon code is not valid")
      // res.status(200).json({msg: coupon_code_status.msg,plan_details: plan_detalis_send,price_details: price_detais,
      //   is_coupon_valid:false
      //   });

        return {status_code:200,msg: coupon_code_status.msg,plan_details: plan_detalis_send,price_details: price_detais,
          is_coupon_valid:false
          }
     }
    
    }
    else {
      // geting caluclations when no coupon code
      console.log("coupon code not exist")
      // res.status(200).json({msg:"ok",plan_details: plan_detalis_send,price_details: price_detais,
      //     });
      return {status_code:200,msg:"ok",plan_details: plan_detalis_send,price_details: price_detais,
          }
      
    }
    // res.status(200).json({msg:"ok",data:result})
  } catch (error) {
    console.log(error);
    // res.status(500).json({ msg: "internal error" });
    return {status:500, msg:"internal error" }
  }
};

// for showing plan details and all calculation like discount,gst tax ,coupon etc
// module.exports.plan_and_payments_and_coupon_code_calc = async (req, res) => {
//   try {
//     // note-only send plan_details that is not confidential like commission,meeting link , these not send in

//     console.log(req.body);
//     const plan_id = req.body.payload.id;
//     const is_coupon = req.body.payload.is_coupon;

//     const plan_details = await Plan_model.findById(plan_id);
//     // console.log(plan_details)
//     const {
//       meeting_link,
//       commision_percentage,
//       meeting_msg,
//       ...plan_detalis_send
//     } = plan_details._doc;

//     const { active, price, is_discount, discount_percentage, gst } =
//       plan_details._doc;
//     // console.log(active);
//     if (active === false) {
//       res.status(403).json({ msg: "plan is deactivated" });
//       return;
//     }

//     // price cal
//     const price_data_details = {
//       is_discount,
//       is_coupon: false,
//       discount_percentage,
//       coupon_discount_percentage: null,
//       price,
//       gst,
//     };
//     const price_detais = plan_payment_calculation(price_data_details);

// // if coupon code
//     if (is_coupon == true) {
//       console.log("coupon code is exist")
//       const coupon_code = req.body.payload.coupon_code;
       
//      const coupon_code_status=await coupon_code_verification(coupon_code);
//      if(coupon_code_status.is_valid==true){
//       console.log("coupon code valid")
//        const coupon_discount_percentage=coupon_code_status.coupon_detais?.discount_percentage;
//        const price_data_details = {
//         is_discount,
//         is_coupon: true,
//         discount_percentage,
//         coupon_discount_percentage: coupon_discount_percentage,
//         price,
//         gst,
//       };
//       const price_detais = plan_payment_calculation(price_data_details);
//       res.status(200).json({msg: coupon_code_status.msg,plan_details: plan_detalis_send,price_details: price_detais,
//         is_coupon_valid:true
//       });
//      }
//      else{
//       console.log("coupon code is not valid")
//       res.status(200).json({msg: coupon_code_status.msg,plan_details: plan_detalis_send,price_details: price_detais,
//         is_coupon_valid:false
//         });
//      }
    
//     }
//     else {
//       // geting caluclations when no coupon code
//       console.log("coupon code not exist")
//       res.status(200).json({msg:"ok",plan_details: plan_detalis_send,price_details: price_detais,
//           });
//     }

//     // res.status(200).json({msg:"ok",data:result})
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: "internal error" });
//   }
// };
module.exports.plan_and_payments_and_coupon_code_calc = async (req, res) => {
  try {
    // note-only send plan_details that is not confidential like commission,meeting link , these not send in

    
    const plan_id = req.body.payload.id;
    const is_coupon = req.body.payload.is_coupon;

    const data=await plan_and_payments_and_coupon_code_calc_function(plan_id,is_coupon,req);
    const {status_code,...rest_data}=data
   console.log(data)
   res.status(status_code).json(rest_data)
  
    // res.status(202).json({msg:"ok"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal error" });
  }
};

module.exports.order = async (req, res) => {
  console.log(["payment order"])
  // console.log(req.body)
  // console.log(req.user)
  try {
    //  making a object, that will have all necessory data
    const seleted_plan_id = req.body.seleted_plan_id;
    const user_id = req.user.user_id;
    const user_email = req.user.user_email;
    const is_coupon = req.body.is_coupon;
    console.log(req.body)
    is_empty_variable(seleted_plan_id, user_id, user_email); //if any argumnet is empty it will throw error


// geting final price that user will have to pay
const data=await plan_and_payments_and_coupon_code_calc_function(seleted_plan_id,is_coupon);
const {status_code,...plan_and_price_details}=data
   if(status_code==403){
    res.status(403).json({plan_and_price_details});
    return;
   }
   const price_details=plan_and_price_details.price_details;




    // // getting plan  details
    const plan_details = await Plan_model.findById(seleted_plan_id);
    const final_plan_price = price_details.final_plan_price;
    //get user details
    const user_resp = await UserModel.findById(user_id);
    console.log(user_resp);
    //create tranction documnet in db
    const transaction_resp = await Transaction_model.create({
      user: user_id,
      plan: seleted_plan_id,
      status: false,
      status_msg: "pending",
    });

    const transaction_id = transaction_resp._id;

    // generating payment order id
    const instance = new Razorpay({
      key_id: razorpay_key_id,
      key_secret: razorpay_key_secret,
    });

    const options = {
      amount: Number(final_plan_price) * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: transaction_id,
    };
    const resp = await instance.orders.create(options);
    // console.log(resp, "resp");
    console.log(plan_details);
    console.log(transaction_resp);
    console.log(options);
    res.status(200).json({
      order_id: resp.id,
      options: options,
      prefill: {
        name: user_resp.name,
        email: user_resp.email,
        contact: user_resp.mobile,
      },
    });
    // res.status(200).json({msg:"ok" });
  } catch (error) {
    console.log(error);
    res.status(401).send("error");
  }
};
module.exports.validation = async (req, res) => {
  // this is to validate that orderid and payment_id is not harmed or malformed or hacked
  // for help- https://github.com/razorpay/razorpay-php/issues/156
  try {
    console.log("validation");
    console.log(req.body);
    is_empty(req.body.payload);
    const razorpay_order_id = req.body.payload.razorpay_order_id;
    const razorpay_payment_id = req.body.payload.razorpay_payment_id;
    const razorpay_signature = req.body.payload.razorpay_signature;
    const transaction_id = req.body.transaction_id;
    // const razorpay_payment_id=req.body.razorpay_payment_id
    var generatedSignature = crypto
      .createHmac("sha256", razorpay_key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    var isSignatureValid = generatedSignature == razorpay_signature; //boolean true/false
    if (isSignatureValid) {
      // console.log(transaction_id);
      const transaction__update_resp =
        await Transaction_model.findByIdAndUpdate(
          { _id: transaction_id },
          { status_msg: "successful", status: true }
        );
      console.log(transaction__update_resp);
      // get plan and user from transaction model
      const transaction_resp = await Transaction_model.findOne({
        _id: transaction_id,
      }).populate("plan user");

      const plan_obj = transaction_resp.plan;
      const user_obj = transaction_resp.user;
      const user_id = transaction_resp.user._id;
      const plan_id = plan_obj._id;
      // console.log(transaction_resp);

      const plans_price = plan_obj.price;
      const gst_percentage = plan_obj.gst;
      const user_commision = plan_obj.commision_percentage;
      const TDS_percentage = 5;

      console.log();
      const payment_calculations_data = payment_calculations(
        plans_price,
        gst_percentage,
        user_commision,
        TDS_percentage
      );

      const Purchase_details_model_resp = await Purchase_details_model.create({
        amount_without_gst: payment_calculations_data.amount_without_gst,
        gst_percentage: payment_calculations_data.gst_percentage,
        TDS_percentage: payment_calculations_data.TDS_percentage,
        payment_platform_charges_percentage:
          payment_calculations_data.razorpay_charges_percentage,
        payment_platform_amount:
          payment_calculations_data.razorpay_charges_amount,
        commission_sales_value_csv:
          payment_calculations_data.commission_sales_value_csv,
        reffral_commission_percentage:
          payment_calculations_data.commision_percentage,
        reffral_commission_amount: payment_calculations_data.commission_amount,
        is_discount: false,
        all_calculations: payment_calculations_data,
      });
      // id or newly stored purchase_details
      const Purchase_details_id = Purchase_details_model_resp._id;
      console.log("Purchase_details_id", Purchase_details_id);

      /*
      checking, is reffral code is exist, 
      if not exist not add or do any thing
      if exist, then get that reffral use , creare a commmission and update the commission balence
*/

      //  geting reffral user id

      const Payment_junction_model = {
        user: user_id,
        plan: plan_id,
        transaction: transaction_id,
        is_discount: false,
        purchase_details: Purchase_details_id,
      };
      console.log(user_obj);
      // updating Payment_junction_model
      if (user_obj.is_referral_exist == true) {
        // getting reffral user id if reffral exist
        console.log(["updating commission balence"]);
        const referral_user_id = user_obj.referral_by_user;
        // getting reffral user object
        const reffral_user_obj = await UserModel.findById(referral_user_id);
        // logic for balenc update
        // get old balence, add 50%  commisiion then add then update it
        console.log(reffral_user_obj);
        const prev_commission_balance = reffral_user_obj.commission_balance;
        console.log(prev_commission_balance);
        // note- only half commission will be added instant and half will be add after 7 days
        // for 7 days, it will be updated using cron jobs
        const caluculated_total_commision =
          payment_calculations_data.commision_amount_after_TDS;
        const half_commission_value = Math.round(
          caluculated_total_commision / 2
        );
        const new_half_commission_balence =
          Number(prev_commission_balance) + Number(half_commission_value);

        const reffral_user_update_resp = await UserModel.findByIdAndUpdate(
          { _id: referral_user_id },
          {
            commission_balance: new_half_commission_balence,
          }
        );
        const reffral_user_obj2 = await UserModel.findById(referral_user_id);

        console.log(reffral_user_obj2);
        console.log("user_obj.is_referral_exist", user_obj.is_referral_exist);
        Payment_junction_model.is_reffral_exist = true;
        Payment_junction_model.reffral_user = referral_user_id;

        //  adding commission balence in reffral user
        // const previous_trffral_user_commission_balance=UserModel.findById()
        // const user_update_resp=UserModel.findByIdAndUpdate({_id:},{})
        // add commision and commision model if reffral exist
        const Commision_tranaction_resp = await Commision_tranaction.create({
          is_amount_added: true,
          commission_amount:
            payment_calculations_data.commision_amount_after_TDS,
        });
        console.log("Commision_tranaction_resp", Commision_tranaction_resp);

        // updating id of recently added Commision_tranaction_resp in Payment_junction_model
        Payment_junction_model.commision_payments =
          Commision_tranaction_resp._id;
      } else {
        Payment_junction_model.is_reffral_exist = false;
      }

      const Payment_junction_resp = await Payment_junction.create({
        ...Payment_junction_model,
        // commision_payments:it will added after commission document created,
      });

      const Payment_junction_id = Payment_junction_resp._id;
      //now updating user model of plan/course purchase,is_enrolled and
      // updating balance
      console.log(user_obj, "user_obj,user_obj");
      const userModel_update_resp = await UserModel.findByIdAndUpdate(
        { _id: user_id },
        {
          plan_purchase_details: Payment_junction_id,
          is_enrolled: true,
        }
      );

      // console.log(payment_calculations_data);
      // console.log(Purchase_details_model_resp._id);
      // console.log(Payment_junction_resp);
      // console.log(userModel_update_resp);
      res.status(200).json({ msg: "successfully purchased" });
    } else {
      res.status(400).json({
        msg: "purchase is not sucessful, please contact to customercare",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("error");
  }
};
