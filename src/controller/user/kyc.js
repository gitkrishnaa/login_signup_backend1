const kyc_model=require("../../model/user/kycModel");
const UserModel = require("../../model/user/user");

module.exports.kyc_upload=async (req,res)=>{
    try {
    //     console.log(req.body);
    // console.log(req.user);
    // const payload=req.body.payload
    // const {user_id}=req.user
    // console.log(payload)
    console.log("req.files",req.files)
    // const kyc_resp=await kyc_model.create({
    //     user_id:user_id,
    //     name:payload.name,
    //     adhar_card:payload.adhar_card_number,
    //     adress:payload.adress,
    //     uploaded_doc:"none",
    //     pan_card:payload.pan_card_number,
    //     bank_account_details:{
    //         bank_name:payload.bank_details.bank_name,
    //         account_number:payload.bank_details.bank_account_no,
    //         ifsc_code:payload.bank_details.bank_ifsc_code,
    //     },
    // })
    // const user_resp=await UserModel.findByIdAndUpdate({_id:user_id},{
    //     kyc_status_msg:"user uploaded data,waiting for verification",
    //     kyc_upload:true,
    //     kyc:kyc_resp._id,
    //     kyc_status:false,

    // })
    // console.log(kyc_resp)
 
 res.status(201).json({msg:"kyc data uploaded sucessfully"})
  
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"internal error"})

    }
  
}
// master user will verify kyc data
// its can only acess my master user
module.exports.kyc_validation_by_master_user=async (req,res)=>{
    try {
        console.log(req.body);
    // console.log(req.user);
    const user_id=req.body.user_id;
    const kyc_status=req.body.kyc_status
    const kyc_status_msg=req.body.kyc_status_message
   
    let kyc_status_boolean
    if(kyc_status=="verified"){
        kyc_status_boolean=true
        const  user_resp=await UserModel.findByIdAndUpdate({_id:user_id},{
            kyc_status_msg:kyc_status_msg,
            kyc_status:kyc_status_boolean
        })
        console.log(user_resp)

    }
    else{
        kyc_status_boolean=false
        const  user_resp=await UserModel.findByIdAndUpdate({_id:user_id},{
            kyc_status_msg:kyc_status_msg,
            kyc_status:kyc_status_boolean,
            kyc_upload:false,
        })
        console.log(user_resp)

    }

    



  

    res.status(200).json({msg:"kyc data updated sucessfully"})
  
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"internal error"})

    }
}
