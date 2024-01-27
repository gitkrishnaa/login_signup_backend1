const check = require("../../utility/user");
const UserModel = require("../../model/user/user");
const Plans_model = require("../../model/master_user/plans");
const Payment_details_junction = require("../../model/payments/payment_details_junction");
const Otp_model = require("../../model/user/otp");

const otpGenerator = require("otp-generator");

const jwt_utility = require("../../utility/jwt");
const auth = require("../../auth/auth");
const checks = require("../../utility/checks");

const { model_names_obj } = require("../../model/Model_obj");
const { email_sending } = require("../../services/emailSend");
const print = require("../../utility/utility").print;
const referral_code_generator =
  require("../../utility/utility").referral_code_generator;
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
  console.log(["signup controller start"]);
  try {
    console.log(req.body);
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const city = req.body.city;
    const state = req.body.state;
    const zipcode = req.body.zipcode;
    let referral_by_code = req.body.referral_by_code || "none";
    let is_referral_exist = false;
    let referral_by_user = undefined;

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
    const is_exist = await UserModel.findOne({ email: email });
    if (is_exist != null) {
      console.log("user already exist");
      res.status(400).json({ msg: "user already exist" });
      return;
    }
    // encrypting password

    const encrypt_passowrd = await checks.encrypt_passowrd(password);

    const model_obj = {
      name: name,
      password: encrypt_passowrd,
      email: email,
      user_referral_code: referral_code_generator()[0],
      mobile: mobile,
      verified: false,
      active: true,
      city: city,
      state: state,
      zipcode: zipcode,
      kyc_upload: false,
      kyc_reupload: false,
      kyc_status_msg: "kyc pending",
      commission_balance: 0,
      kyc_status: false,
      is_referral_exist: is_referral_exist,
      is_enrolled: false,
    };

    // getting reffral code user id if reffral exist
    console.log(referral_by_code, "referral_by_code");
    if (
      referral_by_code === "none" ||
      referral_by_code === "" ||
      referral_by_code === null ||
      referral_by_code === undefined
    ) {
      is_referral_exist = false;
      model_obj.is_referral_exist = is_referral_exist;
    } else {
      const UserModel_resp = await UserModel.find({
        user_referral_code: referral_by_code,
      });
      if (UserModel_resp.length === 1) {
        const user_id = UserModel_resp[0]._id;
        console.log("referral_by_user", user_id);
        is_referral_exist = true;
        model_obj.referral_by_user = user_id;
        model_obj.is_referral_exist = is_referral_exist;
      }
      console.log("UserModel_resp", UserModel_resp, "UserModel_resp");
    }

    //  saving in db

    const result = await UserModel.create(model_obj);
    console.log(result);
    print(req, { model_obj, result });
    res.status(201).json({ msg: "user sign up sucessful" });
    // res.status(400).json({msg:"user sign up sucessful"});
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
  console.log(["signup controller end --># "]);
};
module.exports.login = async (req, res) => {
  console.log(["user_details"]);
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

    const resp = await UserModel.findOne({ email: email });

    if (resp != null) {
      print(req, { resp });
      const decrypted_password = await checks.decrypt_passowrd_compare(
        resp.password,
        password
      );
      print(req, { decrypted_password });
      if (decrypted_password) {
        const jwt_token = await auth.jwt_token_generate(email, resp?._id);
        res.status(200).json({ token: jwt_token });
      } else {
        res.status(401).json({ msg: "passowrd not match" });
      }
    } else {
      res.status(400).json({ msg: "Account not exist" });
    }

    console.log(["login controller end --># "]);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
};
module.exports.user_details = async (req, res) => {
  console.log(["user_details"]);
  try {
    const user = req.user;
    // console.log(user,"data")
    const user_resp = await UserModel.findById(user.user_id).populate([
      {
        path: "payments_details_junction",
        populate: {
          path: "purchase_details transaction",
          // model:"purchase_details",
        },
      },
      { path: "kyc" },
      { path: "referral_by_user" },
      { path: "enrolled_plan" },
    ]);
    console.log(user_resp);
    const { name, email, user_referral_code } = user_resp;
    const { password, ...rest } = user_resp._doc;

    // getting enrolled plan details
    if (user_resp.is_enrolled == true) {
      console.log(user_resp);
      const enrolled_plan_id = user_resp.payments_details_junction.plan;
      const plans_model_data_resp = await Plans_model.findById(
        enrolled_plan_id
      );
      // console.log("plans_model_data_resp", plans_model_data_resp);
      res.status(200).json({
        msg: "ok",
        data: {
          name,
          email,
          user_referral_code,
          user: rest,
          enrolled_plan: plans_model_data_resp,
        },
      });
    } else {
      res.status(200).json({
        msg: "ok",
        data: { name, email, user_referral_code, user: rest },
      });
    }
    // getting data without password
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal error" });
  }
};
// one user
module.exports.user_purchase_history = async (req, res) => {
  console.log(["user_purchase_history"]);
  try {
    const user = req.user;
    // console.log(user,"data")
    const resp = await Payment_details_junction.find({
      user: user.user_id,
    }).populate([
      {
        path: "plan",
        // populate:{
        //     path:"purchase_details transaction",
        //     // model:"purchase_details",
        // },
      },
      { path: "transaction" },
      { path: "purchase_details" },
    ]);
    // console.log(user_resp)
    // const { name, email, user_referral_code } = user_resp;
    // const { password, ...rest } = user_resp._doc;

    console.log(resp);
    res.status(200).json({
      msg: "ok",
      data: resp,
    });

    // getting data without password
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal error" });
  }
};

// send otp
module.exports.forget_password_otp = async (req, res) => {
  console.log(["forget_password_otp"]);
  try {
    const email = req.body.email;
    console.log(email);

    if (email == undefined) {
      res.status(400).send("empty data");
      return;
    }

    const resp = await UserModel.findOne({ email: email });

    if (resp != null) {
      //  if email exist

      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      let result = await Otp_model.findOne({ otp: otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        });
        result = await Otp_model.findOne({ otp: otp });
      }
      const otpPayload = { email, otp, otp_used: false };
      const otpBody = await Otp_model.create(otpPayload);
      console.log(otpBody, otp);

      const email_template = `
    Badamission.com
    OTP for reset your password
    OTP- ${otp} 
    link-www.badamission/reset-password
    
    `;

      const email_resp = await email_sending({
        to:email,
        subject: "Otp for reset passowrd",
        text: email_template,
      });
      console.log(email_resp, "emai_resp");
      res.status(200).json({
        success: true,
        msg: "OTP sent successfully",
      });
    } else {
      res.status(404).json({ msg: "Email not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
};

module.exports.reset_password = async (req, res) => {
  console.log(["user_details"]);
  try {
    const password = req.body.password;
    const otp = req.body.otp;

    // checkuing emapty
    if (otp == undefined || password == undefined) {
      res.status(400).send({ msg: "empty data" });
      return;
    }

    const resp = await Otp_model.findOne({ otp: otp });


    if (resp != null) {
      // checking is otp already used
      console.log(resp,"resp")
      if (resp.otp_used == true) {
        console.log("dont send")
          res.status(400)
          .json({ msg: "OTP is used already, please generate new OTP" });
        return;
      }

      const email = resp.email;
      const encrypt_passowrd = await checks.encrypt_passowrd(password);
      const user_resp = await UserModel.findOneAndUpdate(
        { email: email },
        {
          password: encrypt_passowrd,
        }
      );

      const otp_resp = await Otp_model.findOneAndUpdate(
        { otp: otp },
        {
          otp_used: true,
        }
      );
      console.log(otp_resp)
      const resp_otp2 = await Otp_model.findOne({ otp: otp });
      console.log(resp_otp2);
      // console.log(user_resp);
      res.status(200).json({ msg: "Password changed sucessfully" });
    } else {
      res
        .status(404)
        .json({
          msg: "OTP not Matched, Please Generate OTP again (OTP get expired in 20 minutes)",
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal error");
  }
};
