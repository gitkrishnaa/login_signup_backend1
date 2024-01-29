const Payment_model=require('../../model/payments/payment_details_junction')
module.exports.all_payment_transaction = async (req, res) => {
    
    try {
        const resp=await Payment_model.find().populate("plan purchase_details commision_payments_after_7day commision_payments_same_day reffral_user transaction user")
        res.status(200).json({msg:"all payments tranaction",data:resp})
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:"internal error"})
    }
    };
module.exports.payment_transaction_details = async (req, res) => {
        const payments_id=req.body.id
        try {
            const resp=await Payment_model.findById(payments_id).populate("plan purchase_details commision_payments_after_7day commision_payments_same_day reffral_user transaction user")
            res.status(200).json({msg:"ok",data:resp})
        } catch (error) {
            console.log(error)
            res.status(400).json({msg:"internal error"})
        }
        };
    