const route=require('express').Router();
const user_controller=require("../controller/user/user");
const auth = require("../auth/auth");
const jwt_verify = auth.jwt_token_verify;



route.post("/signup",user_controller.signup)
route.post("/login",user_controller.login)
route.post("/user_details",jwt_verify,user_controller.user_details)

route.get("/devloper",user_controller.devloper)



module.exports=route;