 const checks = require("../../utility/checks");
 const plan_model = require("../../model/user/plans");

module.exports.add_plan=async (req,res)=>{



try {
    console.log(req.body)
    const plan_name=req.body.plan_name
    const price=req.body.price
    const active=req.body.active
    const commision_percentage=req.body.commision_percentage
    const referral_code=req.body.referral_code
const model_obj={
    plan_name:plan_name,
    price:price,
    active:active,
    commision_percentage:commision_percentage,
    referral_code:referral_code, 
}
checks.is_empty(model_obj);
const insert_result=await plan_model.create(model_obj);

console.log(insert_result)

res.status(200).json({msg:"ok"}) 
} catch (error) {
    console.log(error)
    res.status(500).json({msg:"internal error"})   
}
}
module.exports.discount_on_plan=async (req,res)=>{



    try {
        console.log(req.body)
        const plan_name=req.body.plan_name
        
   
    
    // const insert_result=await plan_model.updateAll()
    // insert_result.map()



    console.log(insert_result)
    
    res.status(200).json({msg:"discount applied"}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"internal error"})   
    }
    }