const { is_empty_variable } = require("../../utility/checks");
const coupon_model = require("../../model/master_user/coupon");





module.exports.add_coupon = async (req, res) => {
   console.log(req.body,"body1")
  try {
    const active=req.body.payload.active_status
    const name=req.body.payload.name
    const coupon_code=req.body.payload.coupon_code
    const details=req.body.payload.details
    const expire_date=req.body.payload.expire_date
    const discount_percentage=Number(req.body.payload.discount_percentage)

    is_empty_variable(active,
        name,
        coupon_code,
        details,
        expire_date,
        discount_percentage,
        )
     
     const model_obj={
        active:active,
        name:name,
        coupon_code:coupon_code,
        details:details,
        expire_date:new Date(expire_date),
        discount_percentage:discount_percentage,
        deleted:false,
     }
     console.log(model_obj)
    // if(true){
    //     res.status(200).json({msg:"coupon code already exist"});
    //     return
    // }
    //  checking is coupon code already exist
     const resp_find=await coupon_model.find({coupon_code:coupon_code})
     console.log(resp_find)
    if(resp_find.length>0){
     res.status(200).json({msg:"coupon code already exist"});
     return;
    }

    const resp=await coupon_model.create({...model_obj})
    console.log(resp)
    res.status(201).json({msg:"coupon created successfully"});

  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }

  };
module.exports.all_coupons = async (req, res) => {
    
   try {
 
    
      const resp_find=await coupon_model.find()
    //   console.log(resp_find)
     if(resp_find.length==0){
      res.status(200).json({msg:"no coupon available"});
      return;
     }
     else{
        res.status(200).json({msg:"all coupons",data:resp_find});

     }
 
    
   } catch (error) {
     console.log(error);
     res.status(500).send("internal error");
   }
 
   };
   module.exports.delete_coupon = async (req, res) => {
    
    try {
    const {id}=req.body
     console.log(req.body)
        const resp_find=await coupon_model.findByIdAndUpdate({_id:id},{
            deleted:true, 
        })
     
      res.status(200).json({msg:"all coupons"});

    } catch (error) {
      console.log(error);
      res.status(500).send("internal error");
    }
  
    };