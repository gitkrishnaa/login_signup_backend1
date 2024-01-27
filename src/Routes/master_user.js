const route = require("express").Router();
const auth = require("../auth/auth");
const plans=require("../controller/master_user/plans.js")
const account=require("../controller/master_user/account.js");
const user_data = require("../controller/master_user/user_data.js");
const user_kyc = require("../controller/user/kyc.js");
const coupon=require("../controller/master_user/coupon.js");
const payments=require("../controller/payments/payments.js")
const user_data_sender=require('../controller/master_user/user_data');
const data_sender=require('../controller/master_user/data_sender.js');





const jwt_verify = auth.jwt_token_verify;


const MASTER_ADMIN_CODE = process.env.MASTER_CODE;
const sequrity_middlewere = (req, res, next) => {
    console.log("@sequrity_middlewere")
  const request = req.body;
  console.log(request)
  if (req.body.master_code == undefined) {
    console.log(
      "you cant access api without master_code,please read documentation of master_user"
    );
    res.send(
      "you cant access api without master_code,please read documentation of master_user"
    );
  } else if (Number(MASTER_ADMIN_CODE) == Number(req.body.master_code)) {
    next();
  } else {
    console.log(
      "master code is not matched,please read documentation of master_user"
    );
    res.send(
      "master code is not matched,please read documentation of master_user"
    );
  }
//   console.log(request);
  console.log("sequrity_middlewere@")
};

// route.post("/signup",sequrity_middlewere,user_controller.signup2)
route.post("/login",sequrity_middlewere,account.login);
// all user that have signup
route.get("/all_users",jwt_verify,user_data.all_users);
route.post("/user_details",jwt_verify,user_data.user_details);
route.post("/kyc_verification",jwt_verify,user_kyc.kyc_validation_by_master_user);
route.post("/update_meeting_link",jwt_verify,plans.update_meeting_link);
// plans part,plan mean course
route.post("/add_plan",plans.add_plan);
route.get("/all_plan",plans.all_plans);
route.post("/discount_on_plan",plans.discount_on_plan);
// editing plans
route.patch("/edit_plan",plans.edit_plan);
// coupan codes
route.post("/add_coupon",jwt_verify,coupon.add_coupon);
route.get("/all_coupons",jwt_verify,coupon.all_coupons);
route.post("/delete_coupon",jwt_verify,coupon.delete_coupon);

// manual purchase
route.post("/payment/plan_and_payments_calc",jwt_verify,payments.plan_and_payments_calc_for_admin_manual_plan_purchase),
route.post("/payment/manual_plan_purchase",jwt_verify,payments.manual_plan_purchase_by_admin),


// payment data sending'
route.get("/data/all_payments_transaction",jwt_verify,data_sender.all_payment_transaction),


// commission releted route
route.get("/commission/all_commission",jwt_verify,payments.all_commissions_transactions),
route.get("/commission/user_commission_details",jwt_verify,payments.user_commissions_transactions),
route.post("/commission/update_commission_details",jwt_verify,payments.update_user_commissions_transactions),
// 
// route.patch("/edit_coupon_code",plans.edit_plan);

// user 
route.post("/user/user_referrals",jwt_verify,user_data_sender.user_referrals);

module.exports = route;
