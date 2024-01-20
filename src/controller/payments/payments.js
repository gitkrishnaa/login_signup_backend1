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
const Payment_details_junction = require("../../model/payments/payment_details_junction");
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
const plan_and_payments_discount_and_coupon_code_discount_calc_function = async ({plan_id,is_coupon,coupon_code,user_id}) => {
 

  try {
    // note-only send plan_details that is not confidential like commission,meeting link , these not send in
    console.log(["plan_and_payments_discount_and_coupon_code_discount_calc_function()"])
    console.log(plan_id,is_coupon)
    const plan_details = await Plan_model.findById(plan_id);
    console.log(plan_details)
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
      is_upgrading:false,
      previous_purchased_plan_csv:null,
    };

    // updating price details if user is upgrading
    const user_resp=await UserModel.findById(user_id)
    if(user_resp.is_enrolled==true){
    // finding previous_purchase_plan_csv
    const payment_details_populated=await Payment_details_junction.findById(user_resp.payments_details_junction).populate("purchase_details")
    const commission_sales_value_csv=payment_details_populated.purchase_details.commission_sales_value_csv;
    // console.log(commission_sales_value_csv)
    price_data_details.is_upgrading=true,
    price_data_details.previous_purchased_plan_csv=commission_sales_value_csv
    }

    console.log(price_data_details,"price_data_details")




   

    const price_detais = plan_payment_calculation(price_data_details);//where discount is also calculated

// if coupon code
    if (is_coupon == true) {
      console.log("coupon code is exist")
      // const coupon_code = coupon_code;
       
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

    const user_id = req.user.user_id;
    const plan_id = req.body.id;
    const is_coupon = req.body.is_coupon;
    const coupon_code=req.body.coupon_code
    console.log(req.body)
    const data=await plan_and_payments_discount_and_coupon_code_discount_calc_function({plan_id,is_coupon,coupon_code,user_id});
    const {status_code,...rest_data}=data
    console.log(data,"data")
  //  console.log(data)
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
    const coupon_code=req.body.coupon_code
    // console.log(req.body)
    is_empty_variable(seleted_plan_id, user_id, user_email); //if any argumnet is empty it will throw error







  const user_resp=await UserModel.findById(user_id)
// geting final price that user will have to pay
  // geting final prices and plan details,it will also work if user is upgrading
   const data=await plan_and_payments_discount_and_coupon_code_discount_calc_function({
      plan_id:seleted_plan_id,
      is_coupon:is_coupon,
      coupon_code:coupon_code,
      user_id:user_id,
    });
  


   console.log(req.body,"console.log")
   const {status_code,...plan_and_price_details}=data;
   if(status_code==403){
    res.status(403).json({plan_and_price_details});
    return;
   }
   const price_details=plan_and_price_details.price_details;
   const final_plan_price = price_details.final_plan_price;



    // // getting plan  details
    const plan_details = await Plan_model.findById(seleted_plan_id);
    
    //get user details
 
    // console.log(user_resp);
    //create tranction documnet in db
    const transaction_resp = await Transaction_model.create({
      user: user_id,
      plan: seleted_plan_id,
      status: false,
      status_msg: "pending",
      payment_method:"razorpay online",
      is_cash_payment:false,
      is_added_by_admin:false,
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
    // console.log(plan_details);
    // console.log(transaction_resp);
    // console.log(options);
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
  console.log(["payment validation"])
  // this is to validate that orderid and payment_id is not harmed or malformed or hacked
  // for help- https://github.com/razorpay/razorpay-php/issues/156

  const console_key_details={}
  try {
    // getting details from clients
    console_key_details.req_body=req.body
    const seleted_plan_id = req.body.seleted_plan_id;
    const is_coupon = req.body.is_coupon;
    const coupon_code=req.body.coupon_code;


    // checking is any variable is empty
    // is_empty(req.body.payload);

    

    // if not any variable is empty, then geting transction details
    const razorpay_order_id = req.body.payload.razorpay_order_id;
    const razorpay_payment_id = req.body.payload.razorpay_payment_id;
    const razorpay_signature = req.body.payload.razorpay_signature;
    const transaction_id = req.body.transaction_id;
    


    // validating tranaction details
    var generatedSignature = crypto
      .createHmac("sha256", razorpay_key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    var isSignatureValid = generatedSignature == razorpay_signature; //boolean true/false

    console.log([isSignatureValid,"isSignatureValid"])

    // if validation is ok then it runs, to store and asssign couse and data in database
    if (isSignatureValid==true) {


      // updating tranaction db model
      // console.log(transaction_id);
      const transaction__update_resp =
        await Transaction_model.findByIdAndUpdate(
          { _id: transaction_id },
          { status_msg: "successful",
            status: true,
            order_id:razorpay_order_id,
            payment_id:razorpay_payment_id,
            payment_signature:razorpay_signature,
          }
        );
      // console.log(transaction__update_resp);


      // get plan details and user details from transaction model
      const transaction_resp = await Transaction_model.findOne({
        _id: transaction_id,
      }).populate("plan user");
      // console.log(transaction_resp)
      console_key_details.transaction_resp=transaction_resp
      // assigning values that recived from db
      const plan_obj = transaction_resp.plan;
      const user_obj = transaction_resp.user;
      const user_id = transaction_resp.user._id;
      const plan_id = plan_obj._id;
      const plans_price = plan_obj.price;
      const gst_percentage = plan_obj.gst;
      // note- commission will be decided on referral user plan commission
      const user_commision = plan_obj.commision_percentage;
      // const user_commision = 0

      const TDS_percentage = 5;
      const is_referral_exist=user_obj.is_referral_exist
      const referral_details={
        is_commission_eligible:false,//if referral user who is also enrolled then user will recieve commission
        is_referral_exist:is_referral_exist,
        commission_in_the_enrolled_plan:0,
        referral_user_id:null,
      }
   
      //# if referral exist then commission is calculated else not commission will be 0
      if(is_referral_exist==true){
        const referral_by_user_id=user_obj.referral_by_user;
        const reffral_user_details = await UserModel.findById(referral_by_user_id).populate("enrolled_plan")
        const is_referral_user_enrolled=reffral_user_details.is_enrolled;
      
        if(is_referral_user_enrolled==true){
       const enrolled_plan_commission_percentage=reffral_user_details.enrolled_plan.commision_percentage;
          
       referral_details.is_commission_eligible=true
       referral_details.is_referral_exist=true
       referral_details.commission_in_the_enrolled_plan=enrolled_plan_commission_percentage
       referral_details.referral_user_id=referral_by_user_id
        }
        
        console_key_details.if_true_then_reffral_details={
          is_referral_user_enrolled,
          reffral_user_details,
          user_id
          // is_referral_user_enrolled
        }
      }
    

      //
      // geting final price that user have paid
      data=await plan_and_payments_discount_and_coupon_code_discount_calc_function({
        plan_id:seleted_plan_id,
        is_coupon:is_coupon,
        coupon_code:coupon_code,
        user_id:user_id,
      });
      const {status_code,...plan_and_price_details}=data;
      const price_details=plan_and_price_details.price_details;
      const final_plan_price = price_details.final_plan_price;

      
       //important calculation like gst,tds, commission etc
      const payment_calculations_data = payment_calculations(
        final_plan_price,
        gst_percentage,
        referral_details.commission_in_the_enrolled_plan,
        TDS_percentage
      );

    //  console.log(plan_and_price_details,"plan_and_price_details")
      // inserting purchase details calculation in db
      const Purchase_details_model_obj= {
        original_plan_price:plans_price,
        final_plan_price: payment_calculations_data.final_plan_price,
        gst_percentage: payment_calculations_data.gst_percentage,
        TDS_percentage: payment_calculations_data.TDS_percentage,
        payment_platform_charges_percentage:payment_calculations_data.razorpay_charges_percentage,
        commission_sales_value_csv:payment_calculations_data.commission_sales_value_csv,
        reffral_commission_percentage:payment_calculations_data.commision_percentage,
        reffral_commission_amount: payment_calculations_data.commission_amount,
        is_discount: price_details.is_discount,
        is_coupon:price_details.is_coupon,
        discount_calc_details:price_details,
        all_calculations: payment_calculations_data,
        is_admin_discount:false,
        is_referral_commission_eligible:referral_details.is_commission_eligible,
        is_upgraded:price_details.is_upgrading,
      }
      //  if coupon is applied then add coupon details object in purchase model
      if(coupon_code!==null && is_coupon==true){
        const coupon_detais =await Coupon_model.findOne({ coupon_code: coupon_code });
        Purchase_details_model_obj.coupon_details=coupon_detais
      }

      const Purchase_details_model_resp = await Purchase_details_model.create(Purchase_details_model_obj);
      // id of newly stored purchase_details
      const Purchase_details_id = Purchase_details_model_resp._id;
  

      /*
      note-
      checking, is reffral code is exist, 
      if not exist not add or do any thing
      if exist, then get that reffral use , creare a commmission and update the commission balence
      */

      //  geting reffral user id
      const Payment_junction_model = {
        user: user_id,
        plan: plan_id,
        transaction: transaction_id,
        purchase_details: Purchase_details_id,
      };
      // console.log(user_obj);


      // updating Payment_junction_model

      // getting reffral user id if reffral exist
    if (referral_details.is_referral_exist == true) {
        
        console.log(["updating commission balence"]);
        const referral_user_id =referral_details.referral_user_id;

        // console.log("user_obj.is_referral_exist", user_obj.is_referral_exist);
        Payment_junction_model.is_reffral_exist =referral_details.is_referral_exist;
        Payment_junction_model.reffral_user = referral_user_id;
    
    // logic for adding commission
    // so there will be two entry , first will be same date and 2nd will be after 7 days
    let today = new Date();
    let date_after_7day = new Date();
    date_after_7day.setDate(today.getDate()+7);
    half_commission_amount=Number(payment_calculations_data.commision_amount_after_TDS)/2;
    const commission_model_obj_same_date={
      commission_receiver_user:referral_user_id,
      commission_amount:half_commission_amount,
      date_of_payment:today,
      amount_sent_status:false,
    }
    const commission_model_obj_7day_after_date={
      commission_receiver_user:referral_user_id,
      commission_amount:half_commission_amount,
      date_of_payment:date_after_7day,
      amount_sent_status:false,
    }
    const Commision_tranaction_resp1 = await Commision_tranaction.create(commission_model_obj_same_date);
    const Commision_tranaction_resp2 = await Commision_tranaction.create(commission_model_obj_7day_after_date);


        // updating id of recently added Commision_tranaction_resp in Payment_junction_model
    Payment_junction_model.commision_payments_same_day=Commision_tranaction_resp1._id
    Payment_junction_model.commision_payments_after_7day=Commision_tranaction_resp2.id
    } else {
        Payment_junction_model.is_reffral_exist = false;
      }


      const Payment_junction_resp = await Payment_details_junction.create({
        ...Payment_junction_model,
        // commision_payments:it will added after commission document created,
      });

      const Payment_junction_id = Payment_junction_resp._id;
      //now updating user model of plan/course purchase,is_enrolled and
      // updating balance
      // console.log(user_obj, "user_obj,user_obj");
  
      //now updating user model of plan/course purchase,is_enrolled and
      // updating balance
      // console.log(user_obj, "user_obj,user_obj");
      const userModel_update_resp = await UserModel.findByIdAndUpdate(
        { _id: user_id },
        {
          payments_details_junction: Payment_junction_id,
          enrolled_plan:plan_id,
          is_enrolled: true,
        }
      );

  
  
      console.log(["sucessfully added every thing"])
      console_key_details.key_details={
        Payment_junction_id,
        user_obj_id:user_obj._id,
        transaction_id,
        Purchase_details_id}
      console.log(console_key_details)
      res.status(200).json({ msg: "successfully purchased" });
    } else {
      const transaction__update_resp =
      await Transaction_model.findByIdAndUpdate(
        { _id: transaction_id },
        { status_msg: "payment paid, but not validated, please contact to customer care",
          status: true,
          order_id:razorpay_order_id,
          payment_id:razorpay_payment_id,
          payment_signature:razorpay_signature,
        }
      );
      res.status(400).json({
        msg: "purchase is not successful, please contact to customercare",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("error");
  }
};

// manual/cash purchase done by admin only
