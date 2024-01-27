const { model_names_obj } = require("../../model/Model_obj");

const Razorpay = require('razorpay');
require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports.test=async(req,res)=>{



res.json({msg:"ok"})
    
}
module.exports.payments_test=async(req,res)=>{
const razor_pay_key_id=process.env.RAZOPAY_KEY_ID
const razor_pay_key_secret=process.env.RAZOPAY_KEY_SECRET
console.log(razor_pay_key_id,razor_pay_key_secret)
try {
    const  instance = new Razorpay({
        key_id:razor_pay_key_id ,
        key_secret:razor_pay_key_secret ,
        
      });
      const options = {
        amount: 50000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      const resp=await instance.orders.create(options);
      console.log(resp,"resp")
      res.status(200).json({data:resp})
} catch (error) {
    console.log(error)
    res.status(401).send("error")
}
    }

module.exports.devloper = async (req, res) => {

    try {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kritestemail123@gmail.com',
          pass: 'uoej mujq ymoj ctyg'
        }
      });
      
      var mailOptions = {
        from: 'kritestemail123@gmail.com',
        to: 'Krishna821084@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (error) {
      
    }






      res.send("ok email");
    };