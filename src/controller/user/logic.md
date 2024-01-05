

in payment there is three system 

<!-- i will also use canp -->

# initiate
mean - user cliced to pay
how i know- if order id is generated
what happen on server-
*it will create a transction request ,in db in transction model,on document is created which take record of
user_id
plan_id
order_id
signature_id
status:false
status_msg:pending

# fullfilled/ successful payment
mean- if payment is successful then
how i know- so client will send me 
            order_id
            payment_id
            signature_id
what happen on server-
*in /validation route
steps
  1. # i will validate the signature
     # if validation is sucessful
           *in most secnario ,it will be validated
           then-
           1. update transaction_model-payment_id
                            signature_id
                            stauts:true
                            validate:true
                            status_msg:"sucessful"
            2. create purchase_details in db purchase_details model
            4. update reffral_refral banence in user model
            5. create commission_payment document in db in commission_payment model
            3. create payment_junction in db - it will recaored all the id regarded the transaction or payments,and commisions
    # if validation is not sucessful
            1. update transaction_model-payment_id
                            signature_id
                            stauts:true
                            validate:false
                            status_msg:"payment validation failed"

# on reject or cancel of payment
mean- if payment is unsucessdul then
how i know- so client will send me 
            order_id
            payment_id
            signature_id
what happen on server-
*in /validation route
 
     1. update transaction_model-payment_id
                            signature_id:"none
                            stauts:false
                            validate:false
                            status_msg:"failed"
 