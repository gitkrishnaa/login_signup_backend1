const payments = require('../controller/payments/payments');
const commission = require('../controller/commission/commission_withdraw_user');

const auth = require("../auth/auth");
const jwt_verify = auth.jwt_token_verify;
const route=require('express').Router();

// commission and payment is releted to payments, it will be in payment route
route.post("/order",jwt_verify,payments.order),
route.post("/validation",jwt_verify,payments.validation),


module.exports = route;
