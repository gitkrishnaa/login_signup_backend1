const route = require("express").Router();
const user_controller = require("../controller/user/user.js");
const auth = require("../auth/auth");

const account=require("../controller/master_user/account.js")






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
route.get("/all_users",jwt_verify, (req, res) => {
  res.json("everything is ok");
});

module.exports = route;
