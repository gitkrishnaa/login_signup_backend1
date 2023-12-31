const check = require("../../utility/user");
const userModel = require("../../model/user");
const jwt_utility = require("../../utility/jwt");
const auth = require("../../auth/auth");
const checks = require("../../utility/checks");
const utility=require("../../utility/utility")
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
  res.send("ok");
};
module.exports.signup = async (req, res) => {
  console.log(["#<--signup controller start"]);
  try {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const user_referral_id = req.body.user_referral_id;
    const mobile = req.body.mobile;
    const verified = req.body.verified;
    const active = req.body.active;
    const city = req.body.city;
    const state = req.body.state;
    const zipcode = req.body.zipcode;
    const amount = req.body.amount;
    const reffer_by = req.body.reffer_by;

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
    console.log()
    const encrypt_passowrd=await checks.encrypt_passowrd(password)
    const model_obj = {
      name: name,
      password: encrypt_passowrd,
      email: email,
      user_referral_id: user_referral_id,
      mobile: mobile,
      verified: verified,
      active: active,
      city: city,
      state: state,
      zipcode: zipcode,
      amount: amount,
    };

    //  saving in db
    // const result = await userModel.create(model_obj);
    
    // console.log(result);
    // console.log(model_obj)
    utility.print(req,{model_obj}
    )
    res.status(401).json({ masg:"result" });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
  console.log(["signup controller end --># "]);
};
module.exports.signup2 = async (req, res) => {
  console.log(["#<--signip controller start"]);
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    console.log(email, password, name);

    // password encrypt
    const encrypted_psd = await check.encrypt_passowrd(password);
    // console.log(encrypted_psd)

    const user = new User(name, email, encrypted_psd, false);
    console.log(user);
    const resp = await userModel.create({});

    console.log("resp", resp);
    res.status(200).json({
      status: 200,
      msg: "user signup sucessful,please login now",
      data: { email: email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
  console.log(["signup controller end --># "]);
};
module.exports.login = async (req, res) => {
  try {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const user_referral_id = req.body.user_referral_id;
    const mobile = req.body.mobile;
    const verified = req.body.verified;
    const active = req.body.active;
    const city = req.body.city;
    const state = req.body.state;
    const zipcode = req.body.zipcode;
    const amount = req.body.amount;
    const reffer_by = req.body.reffer_by;

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

    const resp = await checks.query(
      userModel.findOne({ email: user_email }),
      "not found"
    );

    const model_obj = {
      name: name,
      password: password,
      email: email,
      user_referral_id: user_referral_id,
      mobile: mobile,
      verified: verified,
      active: active,
      city: city,
      state: state,
      zipcode: zipcode,
      amount: amount,
      reffer_by: reffer_by,
    };

    res.status(401).json({ msg: "passowrd not match" });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
  console.log(["login controller end --># "]);
};
