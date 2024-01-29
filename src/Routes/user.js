const route=require('express').Router();
const user_controller=require("../controller/user/user");
const kyc_controller=require("../controller/user/kyc");
const commission = require('../controller/commission/commission_withdraw_user');
const test = require('../controller/Test/test');
const user_data_sender = require('../controller/user/data_sender');




const auth = require("../auth/auth");
const jwt_verify = auth.jwt_token_verify;
const multer  = require('multer');
const upload = require("../upload")


// uploading using multer


// const multi = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'adhaar', maxCount: 1 }, { name: 'pancard', maxCount: 1 },{name: 'profile_img', maxCount: 1 },{name: 'bank_document', maxCount: 1 }])

// var storage =   multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, './upload');
//     },
//     filename: function (req, file, callback) {
//       callback(null, file.fieldname + '-' + Date.now());
//     }
//   });
//   const upload = multer({ storage:storage})
//   const multi = upload.fields([{ name: 'file', maxCount: 2 }])

//   const single = upload.single("file")




route.post("/signup",user_controller.signup);
route.post("/forget_password_otp",user_controller.forget_password_otp)
route.post("/email_otp_verification",user_controller.email_otp_verification)
route.post("/reset_password",user_controller.reset_password)
route.post("/login",user_controller.login);
route.post("/user_details",jwt_verify,user_controller.user_details);
route.get("/user_purchase_history",jwt_verify,user_controller.user_purchase_history);
route.post("/kyc_upload",jwt_verify,upload.single,kyc_controller.kyc_upload)
route.post("/add_kyc",jwt_verify,kyc_controller.add_kyc)

route.post("/devloper",test.devloper)


// data sending only
route.get("/data/commission_payments",jwt_verify,user_data_sender.commission_payments_details);// commission releted
route.get("/data/user_referrals",jwt_verify,user_data_sender.user_referrals);
route.get("/data/enrolled_referral_users",jwt_verify,user_data_sender.enrolled_referral_users);




module.exports=route;