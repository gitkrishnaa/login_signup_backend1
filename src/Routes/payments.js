const payments = require('../controller/payments/payments');
const auth = require("../auth/auth");
const jwt_verify = auth.jwt_token_verify;
const route=require('express').Router();


route.post("/order",jwt_verify,payments.order)
route.post("/validation",jwt_verify,payments.validation)

module.exports = route;
