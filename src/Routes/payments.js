const payments = require('../controller/payments/payments');

const route=require('express').Router();


route.get("/order",payments.order)
route.post("/validation",payments.validation)

module.exports = route;
