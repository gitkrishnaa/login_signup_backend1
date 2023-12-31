const mongoose = require("mongoose");


const schema=mongoose.schema({
plan_name:{required:true,type:String},
price:{required:true,type:String},
active:{required:true,type:String},
commision_percentage:{required:true,type:String},
})
const model = mongoose.model("plans", schema);

module.exports = model;