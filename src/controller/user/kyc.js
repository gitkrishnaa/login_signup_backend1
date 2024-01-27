const kyc_model=require("../../model/user/kycModel");
const UserModel = require("../../model/user/user");

module.exports.kyc_upload=async (req,res)=>{
    console.log(['kyc_upload'])
   
    try {
    const {user_id}=req.user;  
    // console.log(req.user)
    // console.log(req.files.adhardcard)
    // console.log(req.files)
   
     const adhardcard=req.files.adhardcard
     const pancard=req.files.pancard
     const profile_image=req.files.profile_image
     const bank_document=req.files.bank_document
    

        const user_resp=await UserModel.findById(user_id)
        const kyc_id=user_resp.kyc;
        console.log(user_resp)
        const kyc_uodate_resp=await kyc_model.findByIdAndUpdate({_id:kyc_id},{
            uploaded_files_details:{
                adhardcard:adhardcard,
                pancard:pancard,
                profile_image:profile_image,
                bank_document:bank_document,   
            }
        })
 

 

 
 res.status(201).json({msg:"kyc data uploaded sucessfully"})
  
    } catch (error) {
        console.log(error.code,"ok")
        if (error.code === 'LIMIT_FILE_SIZE') {
            res.status(400).send({ result: 'fail', error: { code: 1001, message: 'File is too big' } })
            return 
          }
          else{
            console.log(error)
            res.status(500).json({msg:"internal error",error})
    
          }
      
    }
  
}
module.exports.add_kyc=async (req,res)=>{
    console.log(['add_kyc'])
   
    try {
    //  console.log(req.body)
    const payload=req.body.payload
    const {user_id}=req.user
    console.log(user_id)
    // console.log(payload)
    const kyc_resp=await kyc_model.create({
        user_id:user_id,
        name:payload.name,
        adhar_card:payload.adhar_card_number,
        adress:payload.adress,
        uploaded_files_details:{},
        pan_card:payload.pan_card_number,
        bank_account_details:{
            bank_name:payload.bank_name,
            account_number:payload.bank_account_no,
            ifsc_code:payload.bank_ifsc_code,
        },
    })
    const user_resp=await UserModel.findByIdAndUpdate({_id:user_id},{
        kyc_status_msg:"user uploaded data,waiting for verification",
        kyc_upload:true,
        kyc:kyc_resp._id,
        kyc_status:false,

    })
    // console.log(kyc_resp)
 
 res.status(201).json({msg:"kyc data added sucessfully"})
  
    } catch (error) {
       
            console.log(error)
            res.status(500).json({msg:"internal error",error})
    
          
      
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
