const { model_names_obj } = require("../../model/Model_obj");
const userModel = require("../../model/user/user");



module.exports.all_users = async (req, res) => {
    
try {
    const data=await userModel.find(); 
    res.status(200).json({msg:"all user accounts",data})
} catch (error) {
    res.status(400).json({msg:"internall error"})
}
};

module.exports.user_details = async (req, res) => {
    console.log("ok")
    try {
        const user_id=req.body.user_id
        console.log("user_id",user_id)
        
        // const data=await userModel.findById(user_id).exec(); 
        // const data=await userModel.findById(user_id).populate(`${model_names_obj.kyc}`); 

        const data=await userModel.findById(user_id).populate("kyc referral_by_user plan_purchase_details"); 

        console.log(data)
        res.status(200).json({msg:"all user accounts",user_detail:data})
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:"internall error"})
    }
    };
