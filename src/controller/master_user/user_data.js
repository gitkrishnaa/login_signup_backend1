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
        // { 
        //     path: 'pages',
        //     populate: {
        //       path: 'components',
        //       model: 'Component'
        //     } 
        //  }
        // const data=await userModel.findById(user_id).populate("kyc referral_by_user enrolled_plan payments_details_junction"); 
        const data=await userModel.findById(user_id).populate(
            [{
            path: 'payments_details_junction',
            populate:{
                path:"purchase_details",
                // model:"purchase_details",
            },
        },
            { path: 'kyc',},
            { path: 'referral_by_user',},
            { path: 'enrolled_plan',},
            ]
            ); 

        console.log(data)
        res.status(200).json({msg:"one user details",user_detail:data})
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:"internall error"})
    }
    };
module.exports.user_referrals=async (req,res)=>{
        console.log(["user_referrals"])
    try {
        const user_id = req.body.user_id;    
        const user_resp=await userModel.find({referral_by_user:user_id}).populate("enrolled_plan")
        // const required_data=user_resp.map(d=>{
        //     const {name,_id,email}=d
        //     return {name,user_id:_id,email}
        // })
        // console.log(required_data)
        // console.log(user_resp);
        res.status(200).json({msg:"ok",data:user_resp});
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"error"})
    }
    
    
    }


