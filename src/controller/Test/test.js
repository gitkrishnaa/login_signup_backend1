const { model_names_obj } = require("../../model/Model_obj")




module.exports.test=async(req,res)=>{

console.log(model_names_obj)

res.json({msg:"ok"})
    
}