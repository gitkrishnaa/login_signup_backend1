const route=require('express').Router();
const user_controller=require("../controller/user/user");
const kyc_controller=require("../controller/user/kyc");
const commission = require('../controller/commission/commission_withdraw_user');

const auth = require("../auth/auth");
const jwt_verify = auth.jwt_token_verify;
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
route.post("/signup",user_controller.signup)
route.post("/login",user_controller.login)
route.post("/user_details",jwt_verify,user_controller.user_details)
route.post("/kyc_upload",jwt_verify,kyc_controller.kyc_upload)
route.get("/devloper",user_controller.devloper)
route.post("/commission_withdraw_records_user",jwt_verify,commission.commission_withdraw_records_user),



module.exports=route;