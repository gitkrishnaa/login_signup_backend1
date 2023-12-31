
const checks=require("../../utility/checks")
const auth=require("../../auth/auth")
const master_user_model=require("../../model/master_users")
// user class
class User {
  constructor(name, email, password, verified) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.verified = verified;
  }
}
module.exports.devloper = async (req, res) => {


};

module.exports.master_user_create = async (req, res) => {
    try {
        const jwt_token=await auth.jwt_token_generate("email","id");
// creating master user manaul
        const response=await master_user_model.create({
            "name":"Krishna",
            "email":"krishna@gmail.com",
            "password":"123456",
            "isMaster":true,
            "whoIs":"admin"
        })

console.log(response)

        res.status(200).json({token:jwt_token});  
    } catch (error) {
        console.log(error)
        res.json(error)
    }
  };
module.exports.login = async (req, res) => {
    console.log("@login master user login")
    try {
        console.log(req.body)
        
        const user_email=req.body.email;
        const password=req.body.password;
      

        const resp=await checks.query(master_user_model.findOne({email:user_email}),"not found")
        
        if(resp.password==password){
            const jwt_token=await auth.jwt_token_generate("email","id");
            res.status(200).json({token:jwt_token}); 
        }
        else{
            res.status(401).json({msg:"passowrd not match"}); 
        }
     
      
    } catch (error) {
        console.log(error)
        res.json(error)
    }
    console.log("login master user login @")
  };
