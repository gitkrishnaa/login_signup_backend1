require("dotenv").config();
const { model_names_obj } = require("../../model/Model_obj");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { is_empty } = require("../../utility/checks");

const razorpay_key_id = process.env.RAZOPAY_KEY_ID;
const razorpay_key_secret = process.env.RAZOPAY_KEY_SECRET;

module.exports.order = async (req, res) => {
  

  try {
    const instance = new Razorpay({
      key_id: razorpay_key_id,
      key_secret: razorpay_key_secret,
    });
    const options = {
      amount: 50000, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    const resp = await instance.orders.create(options);
    console.log(resp, "resp");

    res.status(200).json({ order_id: resp.id });
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
    is_empty(req.body.payload)
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
