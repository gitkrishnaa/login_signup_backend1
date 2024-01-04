const test = require('../controller/Test/test');

const route=require('express').Router();


route.get("/",test.test)
route.get("/payments",test.payments_test)



module.exports = route;
