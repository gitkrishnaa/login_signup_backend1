const checks = require("../../utility/checks");
const plan_model = require("../../model/user/plans");

module.exports.get_all_plans=async (req,res)=>{



    try {
      
    const result=await plan_model.find();
    console.log(result)
    res.status(200).json({msg:"ok",data:result}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"internal error"})   
    }
    }