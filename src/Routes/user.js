const route=require('express').Router();
const user_controller=require("../controller/user");




route.post("/signup",user_controller.signup2)
route.post("/login",user_controller.login)
route.get("/",user_controller.devloper)



module.exports=route;