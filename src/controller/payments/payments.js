require("dotenv").config();
const { model_names_obj } = require("../../model/Model_obj");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { is_empty, is_empty_variable } = require("../../utility/checks");
const userModel = require("../../model/user/user");
const plan_model = require("../../model/master_user/plans");
const transaction_model = require("../../model/payments/transactions");



const razorpay_key_id = process.env.RAZOPAY_KEY_ID;
const razorpay_key_secret = process.env.RAZOPAY_KEY_SECRET;

module.exports.order = async (req, res) => {
  
// console.log(req.body)
// console.log(req.user)
  try {
//  making a object, that will have all necessory data
   const main_data={}
   const seleted_plan_id=req.body.seleted_plan_id;
   const user_id=req.user.user_id
   const user_email=req.user.user_email
   
   is_empty_variable(seleted_plan_id,user_id,user_email)//if any argumnet is empty it will throw error
  

// getting plan  details
   const plan_details=await plan_model.findById(seleted_plan_id)
   plan_price=plan_details.price
// generateing order id

   const transaction_resp=await transaction_model.create({
    user_id:user_id,
    plan_id:seleted_plan_id,
    status:false,
    status_msg:"pending",
   })

   const transaction_id=transaction_resp._id
   

  
    // generating payment order id
    const instance = new Razorpay({
      key_id: razorpay_key_id,
      key_secret: razorpay_key_secret,
    });
    
    const options = {
      amount: Number(plan_price)*100, // amount in the smallest currency unit
      currency: "INR",
      receipt: transaction_id,
    };
    const resp = await instance.orders.create(options);
    // console.log(resp, "resp");
    console.log(plan_details)
    console.log(transaction_resp)
    console.log(options)
    res.status(200).json({ order_id: resp.id,options:options });
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
    console.log(req.body);
    is_empty(req.body.payload);
    const razorpay_order_id = req.body.payload.razorpay_order_id;
    const razorpay_payment_id = req.body.payload.razorpay_payment_id;
    const razorpay_signature = req.body.payload.razorpay_signature;

    // const razorpay_payment_id=req.body.razorpay_payment_id
    var generatedSignature = crypto
      .createHmac("sha256", razorpay_key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    var isSignatureValid = generatedSignature == razorpay_signature;//boolean true/false
    if(isSignatureValid){
        res.status(200).json({ msg: "successfully purchased" });
        


    }
    else{
        res.status(400).json({ msg: "purchase is not sucessful, please contact to customercare" });
    }
    
  } catch (error) {
    console.log(error);
    res.status(401).send("error");
  }
};
