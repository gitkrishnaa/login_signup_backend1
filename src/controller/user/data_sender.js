
const userModel = require("../../model/user/user");

// it will used to send data for user panel


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