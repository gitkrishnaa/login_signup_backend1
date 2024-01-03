const bcrypt=require('bcrypt')

const userModel = require("../model/user/user");



module.exports=class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  
  }


 
  static email_validate(email) {
    console.log("User-> email_validate()");

try {
    // if email is not string
    if (typeof email != "string") {
        return {
          status: false,
          msg: `email must be string ,but it is ${typeof email}`,
        };
      }
  // checking @ is aviliable in email or not  
      const arr = Array.from(email);
      let temp = false;
  
      arr.forEach((element) => {
        if (element == "@") {
          temp = true;
        }
      });
  
      if (temp) {
        return { status: true, msg: `email is valid format`, data: undefined };
      } else {
        return { status: false, data: undefined, msg: `@ is not in email` };
      }
} catch (error) {
    return {
        status:false, msg:"internal error in /check/user"
    }
}
  }

  static password_validate(data) {
    try {
        console.log("User-> password_validate()");

        // checking psd length greated than 5;
            if (data.length<5) {
              return {
                status: false,
                msg: `password must be greater than 5 char`,
              };
            }
        
            let temp = true;
        
        
            if (temp) {
              return { status: true, msg: `password is valid`, data: undefined };
            } else {
              return { status: false, data: undefined, msg: `password is not valid` };
            }
          
    } catch (error) {
        return {
            status:false, msg:"internal error in /check/user"
        }
    }
   
   
  }

  static async is_user_exist_in_db(email){

try {
    const resp=await userModel.find({"email":email});  
    // console.log(resp)
    if(resp.length>0){
        return {status:200,response:true,message:"user exist",data:resp} 
    }
else{
    return {status:404,response:false,message:"user not exist",data:resp} 
}


} catch (error) {
   return {status:500,message:"internal error",error:error} 
}
  }
static async encrypt_passowrd(passowrd){
 
  try {
    const saltRound=10;
    const get_salt=await bcrypt.genSalt(saltRound);
    const encrypted_psd=await bcrypt.hash(passowrd,get_salt);
return encrypted_psd;

  } catch (error) {
    return error;
  }
}
static async decrypt_passowrd_compare(encrypted_psd,entered_psd){
    console.log(encrypted_psd,entered_psd)
 const result=await bcrypt.compare(entered_psd,encrypted_psd);
return result;
// it retyurn promise boolean true/false
}  
}