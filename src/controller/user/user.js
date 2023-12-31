const check = require("../../utility/user");
const userModel = require("../../model/user");
const jwt_utility = require("../../utility/jwt");
const auth = require("../../auth/auth");
const checks = require("../../utility/checks");
const print = require("../../utility/utility").print;
const referral_code_generator=require("../../utility/utility").referral_code_generator
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
  // console.log(referral_code_generator())
  res.send("ok");
};
module.exports.signup = async (req, res) => {
  console.log(["#<--signup controller start"]);
  try {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const user_referral_code = req.body.user_referral_code;
    const mobile = req.body.mobile;
    const verified = req.body.verified;
    const active = req.body.active;
    const city = req.body.city;
    const state = req.body.state;
    const zipcode = req.body.zipcode;
    const amount = req.body.amount;
    const referral_by_id = req.body.reffer_by;

    console.log(email, password);
    // checkuing emapty
    if (email == undefined || password == undefined) {
      res.status(400).send("empty data");
      return;
    }

    // checking email valid or not
    const email_valid = check.email_validate(email);
    if (email_valid.status == false) {
      res.status(400).send("not valid email");
      return;
    }

    // encrypting password
    console.log();
    const encrypt_passowrd = await checks.encrypt_passowrd(password);
    const model_obj = {
      name: name,
      password: encrypt_passowrd,
      email: email,
      user_referral_code:referral_code_generator()[0],
      mobile: mobile,
      verified: verified,
      active: active,
      city: city,
      state: state,
      zipcode: zipcode,
      amount: amount,
    };

    //  saving in db

    const is_exist = await userModel.findOne({email:email});
    if(is_exist!=null){
      res.status(400).json({msg:"user already exist"});
     return 
    }

    const result = await userModel.create(model_obj);
    console.log(result)
    print(req, { model_obj, result });
    res.status(201).json({msg:"user sign up sucessful"});
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
  console.log(["signup controller end --># "]);
};

module.exports.login = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
  
print(req, { password, email });
    // checkuing emapty
    if (email == undefined || password == undefined) {
      res.status(400).send("empty data");
      return;
    }

    // checking email valid or not
    // const email_valid = check.email_validate(email);
    // if (email_valid.status == false) {
    //   res.status(400).send("not valid email");
    //   return;
    // }


    const resp = await userModel.findOne({ email: email })

    if(resp!=null){
      print(req,{resp})
      const decrypted_password=await checks.decrypt_passowrd_compare(resp.password,password)
      print(req,{decrypted_password})
      if (decrypted_password) {
        const jwt_token = await auth.jwt_token_generate(email, resp?._id);
        res.status(200).json({ token: jwt_token });
      } else {
        res.status(401).json({ msg: "passowrd not match" });
      }
    }
    else{
      res.status(400).json({ msg: "Account not exist" });
    }




    console.log(["login controller end --># "]);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
 
};
