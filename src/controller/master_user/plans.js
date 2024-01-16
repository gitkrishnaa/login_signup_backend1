const checks = require("../../utility/checks");
const Plan_model = require("../../model/master_user/plans");
const { payment_calculations } = require("../../data/data");

module.exports.add_plan = async (req, res) => {
  try {
    console.log(req.body);
    const plan_name = req.body.plan_name;
    const price = req.body.price;
    const active = req.body.active;
    const commision_percentage = req.body.commision_percentage;
    const referral_code = req.body.referral_code;
    const model_obj = {
      plan_name: plan_name,
      price: price,
      active: active,
      commision_percentage: commision_percentage,
      referral_code: referral_code,
    };
    checks.is_empty(model_obj);
    const insert_result = await plan_model.create(model_obj);

    console.log(insert_result);

    res.status(200).json({ msg: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal error" });
  }
};
module.exports.edit_plan = async (req, res) => {
  try {
    console.log(req.body);
    // const plan_name = req.body.plan_name;
    const plan_id=req.body.plan_id
    const price = req.body.price;
    const active = req.body.active;
    const commision_percentage = req.body.commision_percentage;
    let current_date= new Date().toLocaleString();
    const model_obj = {
      price: price,
      active: active,
      commision_percentage: commision_percentage,
      updatedAt:current_date
    };
    console.log(model_obj);
    checks.is_empty(model_obj);
    const resp = await Plan_model.findByIdAndUpdate({_id:plan_id},{
    ...model_obj
    })
    const resp_find = await Plan_model.findById(plan_id)
    const payment_calculations_result=payment_calculations(resp_find.price,18,resp_find.commision_percentage,5)
// sending caluculations
  

    console.log(resp_find);
    res.status(200).json({ msg: "updated",calculation:payment_calculations_result});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal error" });
  }
};
module.exports.plan_discount = async (req, res) => {
  try {
    console.log(req.body);
    const plan_name = req.body.plan_name;
    const price = req.body.price;
    const active = req.body.active;
    const commision_percentage = req.body.commision_percentage;
    const referral_code = req.body.referral_code;
    const model_obj = {
      plan_name: plan_name,
      price: price,
      active: active,
      commision_percentage: commision_percentage,
      referral_code: referral_code,
    };
    checks.is_empty(model_obj);
    const insert_result = await Plan_model.create(model_obj);

    console.log(insert_result);

    res.status(200).json({ msg: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal error" });
  }
};


module.exports.discount_on_plan = async (req, res) => {
  try {
    console.log(req.body);
    const plan_name = req.body.plan_name;

    // const insert_result=await plan_model.updateAll()
    // insert_result.map()

    console.log(insert_result);

    res.status(200).json({ msg: "discount applied" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal error" });
  }
};
module.exports.update_meeting_link=async (req,res)=>{
try {
  const {selected_plan_id,meeting_link,message}=req.body;
  checks.is_empty_variable(selected_plan_id,meeting_link)
  const plan_model_resp=await Plan_model.findByIdAndUpdate({_id:selected_plan_id},{
    meeting_link:meeting_link,
    meeting_msg:message,
  })
console.log(plan_model_resp)
  res.status(200).json({msg:"meeting link updated sucessfully"})
} catch (error) {
  res.status(500).json({msg:"error in meetig link update"})

}
}
