const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");


const schema = mongoose.Schema({
    name:{required:true,type:String},
    email:{required:true,unique:true,type:String},
    password:{required:true,type:String},
    isMaster:{required:true,type:Boolean},
    whoIs:{required:true,type:String},

})

const model=mongoose.model(model_names_obj.master_user,schema);
module.exports=model;