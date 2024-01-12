const payments = require('../controller/payments/payments');
const auth = require("../auth/auth");
const jwt_verify = auth.jwt_token_verify;
const route=require('express').Router();


route.post("/order",jwt_verify,payments.order),
route.post("/validation",jwt_verify,payments.validation),
route.post("/balence_withdraw",jwt_verify,payments.balence_withdraw),

module.exports = route;
