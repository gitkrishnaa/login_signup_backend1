const JWT=require("jsonwebtoken")

const jwt_key=process.env.JWTKEY

module.exports.jwt_token_generate=async(user_email,user_id)=>{
   
    if(user_email==undefined || user_id==undefined ){
     throw new Error("user_email and user_id not provided")
    }
    else{
        const token=await JWT.sign({user_email:user_email,user_id:user_id},jwt_key)
        // console.log(token);
        return token;
    }
  

}
module.exports.jwt_token_verify=async (req,res,next)=>{

try {
    console.log("@jwt_verify")
    const token=req.headers['authorization']
 console.log(token)
//  
    if(token==undefined){
        res.status(400).send("token not recieved")
    }
    else{
        const jwt_verify= JWT.verify(token,jwt_key); 
        // console.log(jwt_verify)
         req.user=jwt_verify
         next()
    }
} catch (error) {
    console.log("error in jwt token verify")
    console.log("message-",error.message)
    res.status(400).send(error)
}

console.log("@jwt_verify")
}