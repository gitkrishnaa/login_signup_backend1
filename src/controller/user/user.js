const check = require("../../utility/user");
const userModel = require("../../model/user");
const jwt_utility = require("../../utility/jwt");
const auth=require("../../auth/auth")
const checks = require("../../utility/checks");
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
  console.log(["#<--signip controller start"]);
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    console.log(email, password, name);
    // checkuing emapty
    if (email == undefined || password == undefined || name == undefined) {
      res.status(400).send("empty data");
      return;
    }

    // checking email valid or not
    const email_valid = check.email_validate(email);
    if (email_valid.status == false) {
      res.status(400).send("not valid email");
      return;
    }
    console.log(req.body)
   
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
    const email = req.body.email;
    const password = req.body.password;

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

    if (resp.password == password) {
      const jwt_token = await auth.jwt_token_generate("email", "id");
      res.status(200).json({ token: jwt_token });
      return
    } else {
      res.status(401).json({ msg: "passowrd not match" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
  console.log(["login controller end --># "]);
};
