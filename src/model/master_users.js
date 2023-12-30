const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name:{required:true,type:String},
    email:{required:true,type:String},
    password:{required:true,type:String},
    isMaster:{required:true,unique:true,type:Boolean}
})

const model=mongoose.model("master",schema);
module.exports=model;