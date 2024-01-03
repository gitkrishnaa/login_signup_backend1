const route = require("express").Router();
const auth = require("../auth/auth");
const plans=require("../controller/user/plans");
 
const jwt_verify = auth.jwt_token_verify;

route.get("/plans",plans.get_all_plans);
module.exports = route;