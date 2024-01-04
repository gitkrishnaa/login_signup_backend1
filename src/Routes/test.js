const { test } = require('../controller/Test/test');

const route=require('express').Router();

route.get("/",test)



module.exports = route;
