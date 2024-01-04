const mongoose = require("mongoose");
const { model_names_obj } = require("../Model_obj");

const schema=mongoose.Schema({
payments_id:{type:mongoose.Types.ObjectId,ref:"user",},

})
const model = mongoose.model(model_names_obj.transactions,schema );
module.exports = model;