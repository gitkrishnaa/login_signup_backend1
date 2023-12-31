const route=require('express').Router();
const user_controller=require("../controller/user/user");




route.post("/signup",user_controller.signup)
route.post("/login",user_controller.login)
route.get("/devloper",user_controller.devloper)



module.exports=route;