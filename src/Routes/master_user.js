const route = require("express").Router();
const auth = require("../auth/auth");
const plans=require("../controller/master_user/plans.js")
const account=require("../controller/master_user/account.js");
const user_data = require("../controller/master_user/user_data.js");
const user_kyc = require("../controller/user/kyc.js");






const jwt_verify = auth.jwt_token_verify;


const MASTER_ADMIN_CODE = process.env.MASTER_ADMIN_CODE;
const sequrity_middlewere = (req, res, next) => {
    console.log("@sequrity_middlewere")
  const request = req.body;
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

route.post("/add_plan",plans.add_plan);
route.post("/discount_on_plan",plans.discount_on_plan);
module.exports = route;
