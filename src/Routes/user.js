const route=require('express').Router();
const user_controller=require("../controller/user/user");
const kyc_controller=require("../controller/user/kyc");
const commission = require('../controller/commission/commission_withdraw_user');
const test = require('../controller/Test/test');
const user_data_sender = require('../controller/user/data_sender');




const auth = require("../auth/auth");
const jwt_verify = auth.jwt_token_verify;
const multer  = require('multer');



// uploading using multer
const upload = multer({ dest: 'uploads/' })

const cpUpload = upload.fields([{ name: 'adhaar', maxCount: 1 }, { name: 'pan', maxCount: 1 },{name: 'img', maxCount: 1 }])



route.post("/signup",user_controller.signup)
route.post("/login",user_controller.login)
route.post("/user_details",jwt_verify,user_controller.user_details)
route.post("/kyc_upload",cpUpload,kyc_controller.kyc_upload)
route.post("/devloper",test.devloper)

// data sending only
route.get("/data/user_referrals",jwt_verify,user_data_sender.user_referrals);




module.exports=route;