
const userModel = require("../../model/user/user");
const  Commision_tranaction= require("../../model/payments/commission_transaction");
const  Payments_model= require("../../model/payments/payment_details_junction");

// it will used to send data for user panel,


// this will used to get all users that is created account with that reffral links
module.exports.user_referrals=async (req,res)=>{
    console.log(["user_referrals"])
try {
    const {user_id} = req.user;    
    const user_resp=await userModel.find({referral_by_user:user_id});
    const required_data=user_resp.map(d=>{
        const {name,_id,email}=d
        return {name,user_id:_id,email}
    })
    // console.log(required_data)
    // console.log(user_resp);
    res.status(200).json({msg:"ok",data:required_data});
} catch (error) {
    res.status(500).json({msg:"error"})
}


}

module.exports.commission_payments_details=async (req,res)=>{
    try {
        // console.log("he;lo")
        // note all user id which as referal in 
        const user_id=req.user.user_id;
        console.log(user_id)
        const commission_resp=await Commision_tranaction.find({commission_receiver_user:user_id});
        // console.log(commission_resp,commission_resp.length);
        if(commission_resp.length==0){
            // note -why i have used status in json- because if status will true then frontend will render else show data not loaded
            return res.status(200).json({msg:"data not avaliable",status:true,data:commission_resp}) 
        }
        else{
            return res.status(200).json({msg:"ok",status:true,data:commission_resp}) 
        }
        res.status(200).json({msg:"ok"}) 

    } catch (error) {
        res.status(500).json({msg:"error"}) 
    }
}

module.exports.enrolled_referral_users=async (req,res)=>{
    try {
        console.log(["enrolled_referral_users"])
        // note all user id which as referal in 
        const user_id=req.user.user_id;
        console.log(user_id)
        const resp=await Payments_model.find({reffral_user:user_id}).populate("plan purchase_details")
        console.log(resp)
        
        if(resp.length==0){
            // note -why i have used status in json- because if status will true then frontend will render else show data not loaded
            return res.status(200).json({msg:"data not avaliable",status:false,data:{}}) 
        }
        else{
            const plan=resp;
        // const {is_upgraded} =resp.purchase_details
            return res.status(200).json({msg:"ok",status:true,data:resp}) 
        }
        res.status(200).json({msg:"ok"}) 

    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"error"}) 
    }
}