const userModel = require("../../model/user/user");
const commission_balance_withdraw = require("../../model/commission/commission_withdraw_req");
// it will be acess by user or admin
// this not used now but it can be used in future
module.exports.commission_balance_withdraw = async (req, res) => {
  try {
    const { user_id } = req.user;
    console.log(req.user);
    const amount = Number(req.body.payload.amount);

    // if(amount<500){
    // res.status(406).json({ msg: "Amount must be greater than 500 rupees" });
    // return;
    // }
    //   check is kyc_status is true,THEN continue else send update kyc
    const { kyc_status, commission_balance } = await userModel.findById(
      user_id
    );
    console.log(kyc_status);

    if (kyc_status == false) {
      res.status(403).json({ msg: "Your Kyc is not updated" });
      return;
    }
    if (typeof amount != "number") {
      throw new Error("amount must be number");
    }
    // checking balence must be aviliable to be withdraw\
    console.log(commission_balance, amount);
    if (commission_balance < amount) {
      res
        .status(406)
        .json({ msg: "withdraw amount cannot be greater than balence" });
      return;
    }
    const model_obj = {
      withdraw_amount: amount,
      user_id: user_id,
      transfer_status:false,
    };
    const commission_balance_withdraw_resp =
      await commission_balance_withdraw.create(model_obj);
  
       const rest_balance=commission_balance-amount
       console.log(rest_balance,commission_balance_withdraw,amount)
    const userModel_update_resp = await userModel.findByIdAndUpdate(
      { _id: user_id },
      {
        commission_balance:rest_balance
      }
    );

    console.log(commission_balance_withdraw_resp);

    res.status(200).json({ msg: "requst submitted successful",available_balence:rest_balance,record:commission_balance_withdraw_resp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error 789789" });
  }
};

module.exports.commission_withdraw_records_user=async(req,res)=>{
    try {
// it can used by admin or user, admin have own jwt key, but for user specific it need user_id
     user_id=req.body.payload.user_id;
     console.log(user_id)
     const resp=await commission_balance_withdraw.find({user_id:user_id});
     console.log(resp)
     res.status(200).json({ msg: "data send sucessfully",data:resp});
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "785258" });

    }
}