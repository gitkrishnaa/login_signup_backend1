const route = require("express").Router();
const auth = require("../auth/auth");
const plans=require("../controller/public/plan");
 
// it will be public route


route.get("/plans",plans.get_all_plans);
module.exports = route;