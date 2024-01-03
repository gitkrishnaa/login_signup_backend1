const userModel = require("../../model/user/user");



module.exports.all_users = async (req, res) => {
    
try {
    const data=await userModel.find();
   
   
    res.status(200).json({msg:"all user accounts",data})
} catch (error) {
    res.status(400).json({msg:"internall error"})
}
};