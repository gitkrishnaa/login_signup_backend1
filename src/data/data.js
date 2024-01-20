const data = {
  razorpay_charges_percentage: 2,
  TDS_percentage: 5,
};

const claculate_func = (
  amount,
  gst_percentage_p,
  commission_percentage_p,
  TDS_percentage_p
) => {
  const razorpay_charges_percentage = 2;

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

  const number_decimal_format = (number) => {
    return Number(number.toFixed(2));
  };

  function percentage(value, percent) {
    // return Math.round((value*percent)/100)
    // return (Math.round((value*percent)/100) / 100).toFixed(2);
    return number_decimal_format((value * percent) / 100);
  }

  const amount_without_gst = Number(amount);
  const gst_percentage = Number(gst_percentage_p);
  const commision_percentage = Number(commission_percentage_p);
  const razorpay_charges_amount = percentage(
    amount_without_gst,
    razorpay_charges_percentage
  );
  const commission_sales_value_csv =
    amount_without_gst - razorpay_charges_amount;
  const commission_amount = percentage(
    commission_sales_value_csv,
    commission_percentage_p
  );
  const TDS_amount = percentage(commission_amount, TDS_percentage_p);
  const commision_amount_after_TDS = commission_amount - TDS_amount;
  const obj = {
    total_amount: (amount_without_gst * (100 + gst_percentage)) / 100,
    amount_without_gst,
    gst_percentage,
    commision_percentage,
    razorpay_charges_amount,
    razorpay_charges_percentage,
    commission_sales_value_csv,
    commission_amount,
    TDS_percentage: TDS_percentage_p,
    TDS_amount,
    commision_amount_after_TDS,
  };

  return obj;
};
// updated calculation 21.56 two decimal points
const number_decimal_format = (number) => {

  const in_number=Number(number)
  console.log(in_number)
  return Number(in_number.toFixed(2));
};
function percentage_value(value, percent) {
  // return Math.round((value*percent)/100)
  // return (Math.round((value*percent)/100) / 100).toFixed(2);
  return number_decimal_format((value * percent) / 100);
}

// for plan price calculation where all calculation like gst, coupon, tds,commission,etc will calculated,all calculation that we need as data
const payment_calculations = (
  amount,
  gst_percentage_p,
  commission_percentage_p,
  TDS_percentage_p
) => {
  /*
  // logic for calculations
  //
 if amount is 1000
 gst 18%- so value-180
 razorpay 2%,value-20
 CSV common_sales_value=800  means 80%
 if commission_percentage="40%"
 commission_percentage_value=320
 Tds_percentage=5%
 Tds_percentage_value=320*16/100=16
 commission_after_tds=320-16=304
 
*/

  const razorpay_charges_percentage = 2;
  const gst_percentage = Number(gst_percentage_p);
  const commision_percentage = Number(commission_percentage_p);
  const TDS_percentage = Number(TDS_percentage_p);

  const final_amount = Number(amount);
  const amount_without_gst = percentage_value(final_amount, 82);
  const gst_amount = percentage_value(final_amount, gst_percentage);
  const CSV_commission_sales_value = percentage_value(final_amount, 80);
  const commission_amount = percentage_value(
    CSV_commission_sales_value,
    commision_percentage
  );
  const razorpay_charges_amount = percentage_value(
    final_amount,
    razorpay_charges_percentage
  );
  const TDS_amount = percentage_value(commission_amount, TDS_percentage);
  const commision_amount_after_TDS = number_decimal_format(
    commission_amount - TDS_amount
  );
  const obj = {
    final_plan_price: final_amount,
    plan_price_without_gst:amount_without_gst,
    gst_percentage,
    gst_amount,
    razorpay_charges_amount,
    razorpay_charges_percentage,
    commision_percentage,
    TDS_percentage: TDS_percentage_p,
    TDS_amount,
    commission_sales_value_csv: CSV_commission_sales_value,
    commission_amount,
    commision_amount_after_TDS,
  };

  return obj;
};

// for plan price calculation where couponcode, discont, gst,it will be show to user when user puchase
const plan_payment_calculation = (data) => {
  // data:{
  //   is_discount,
  //   is_coupon,
  //   discount_percentage,
  //   coupon_discount_percentage,
  //   plan_price
  //   gst,
  // }

  const orignal_plan_price = data.price;
  const is_discount = data.is_discount;
  const is_coupon = data.is_coupon;
  let final_plan_price = Number(orignal_plan_price);
  const gst = data.gst;

  let discount_percentage = null;
  let coupon_discount_percentage = null;
  let discount_value = null;
  let coupon_discount_value = null;

  if (is_discount == true) {
    discount_percentage = data.discount_percentage;
    discount_value = Number(final_plan_price * discount_percentage) / 100;
    final_plan_price = final_plan_price - discount_value;
  }
  if (is_coupon == true) {
    coupon_discount_percentage = data.coupon_discount_percentage;
    coupon_discount_value =
      Number(final_plan_price * coupon_discount_percentage) / 100;
    final_plan_price = final_plan_price - coupon_discount_value;
  }
  const gst_value = Number(final_plan_price * gst) / 100;
  const plan_price_without_gst = final_plan_price - gst_value;
  return {
    orignal_plan_price:number_decimal_format(orignal_plan_price),
    final_plan_price:number_decimal_format(final_plan_price),
    gst:number_decimal_format(gst),
    gst_value:number_decimal_format(gst_value),
    plan_price_without_gst:number_decimal_format(plan_price_without_gst),
    discount_percentage:number_decimal_format(discount_percentage),
    discount_value:number_decimal_format(discount_value),
    coupon_discount_percentage:number_decimal_format(coupon_discount_percentage),
    coupon_discount_value:number_decimal_format(coupon_discount_value),
    is_discount,
    is_coupon,
  };
};

module.exports.payment_calculations = payment_calculations;
module.exports.plan_payment_calculation = plan_payment_calculation;
