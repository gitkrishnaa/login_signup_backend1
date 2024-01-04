
const data={
razorpay_charges_percentage:2,
TDS_percentage:5
}

class Claculate{
    #razorpay_charges_percentage=2;
    #TDS_percentage=5;
    constructor(amount_without_gst,gst_percentage){
      this.amount_without_gst=amount_without_gst;
      this.gst_percentage=gst_percentage
    }
//   after inproduction, never edit it, if need, create new one
   final_data(){
    
   }

}

const claculate_func=(amount_without_gst,gst_percentage,commission_percentage)=>{
    const razorpay_charges_percentage=2;
    const TDS_percentage=5;
   

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


*/
     
    const amount_without_gst=Number(amount_without_gst)
    const gst_percentage=Number(gst_percentage)
    const commision_percentage=Number(commision_percentage)
    const razorpay_charges_amount=amount_without_gst%razorpay_charges_percentage;
    const commission_sales_value_csv=amount_without_gst-razorpay_charges_amount;
    const commission_amount=commission_sales_value_csv%commission_percentage

    const obj={
        amount_without_gst,
        gst_percentage,
        commision_percentage,
        razorpay_charges_amount,
        commission_sales_value_csv,
        commission_amount,

    }

  return obj;


}


module.exports.claculate=Claculate