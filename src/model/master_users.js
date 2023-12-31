const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name:{required:true,type:String},
    email:{required:true,unique:true,type:String},
    password:{required:true,type:String},
    isMaster:{required:true,type:Boolean},
    whoIs:{required:true,type:String,}

})

const model=mongoose.model("master",schema);
module.exports=model;