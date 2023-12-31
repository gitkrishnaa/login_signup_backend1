// it will check the query, if null then status will false
const bcrypt=require('bcrypt')
module.exports.query = async (moongoose_query, res) => {
  const resp = await moongoose_query;
  if (resp == null) {
    console.log("query respone:", resp);
    console.log(["query returned null data"]);
    throw new Error(res);
    return;
  } else {
    return resp;
  }
};
module.exports.encrypt_passowrd = async (passowrd) => {
  try {

    const saltRound = 10;
    const get_salt = await bcrypt.genSalt(saltRound);
    const encrypted_psd = await bcrypt.hash(passowrd, get_salt);
    return encrypted_psd;
  } catch (error) {
    return error;
  }
};

module.exports.decrypt_passowrd_compare=async(encrypted_psd,entered_psd)=>{
 const result=await bcrypt.compare(entered_psd,encrypted_psd);
return result;
// it retyurn promise boolean true/false
}  

module.exports.is_empty=(obj)=>{
    console.log(obj)
    for (const item in obj) {
        // console.log("item", item)
       if(obj[item]==undefined ||obj[item]==""){
        console.log(["messge(from .is_empty)",`obj.${item} is undefined`])
        // throw new Error({msg:"is undefined"})
       }
    }
  
}
