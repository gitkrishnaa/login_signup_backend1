
const data={
razorpay_charges_percentage:2,
TDS_percentage:5
}



const claculate_func=(amount,gst_percentage_p,commission_percentage_p,TDS_percentage_p)=>{
    const razorpay_charges_percentage=2;
    
    

// logic for calculations
// amount mean the amount without gst

// calculations start
// i am taking amount 100



/*
if total plan_price=118
 so 
   amount=100  //without gst
if gst_percentage- 18
then gst_amount=18

total_payble_amount=amount+gst_amount
so total_payble_amount=118

if razorpay_charges_in_percentage=2
razorpay_charges_amount=2

CSV-commision_sales_value=amount-razorpay_charges_amount
so 
commision_sales_value=98

# reffral commision
if reffral_commision_percentage=50
so
reffral_commision_amount=commision_sales_value%50
so reffral_commision_amount=49


commision_sales_value=%


*/ function percentage(value,percent){
return Math.round((value*percent)/100)
}
     
    const amount_without_gst=Number(amount)
    const gst_percentage=Number(gst_percentage_p)
    const commision_percentage=Number(commission_percentage_p)
    const razorpay_charges_amount=percentage(amount_without_gst,razorpay_charges_percentage)
    const commission_sales_value_csv=amount_without_gst-razorpay_charges_amount;
    const commission_amount=percentage(commission_sales_value_csv,commission_percentage_p)
    const TDS_amount=percentage(commission_amount,TDS_percentage_p)
    const commision_amount_after_TDS=commission_amount-TDS_amount
    const obj={
        total_amount:amount_without_gst*(100+gst_percentage)/100,
        amount_without_gst,
        gst_percentage,
        commision_percentage,
        razorpay_charges_amount,
        razorpay_charges_percentage,
        commission_sales_value_csv,
        commission_amount,
        TDS_percentage:TDS_percentage_p,
        TDS_amount,
        commision_amount_after_TDS
    
    }

  return obj;


}


module.exports.payment_calculations=claculate_func;