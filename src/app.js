
const express=require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const cors = require('cors');

// file improting
const db=require("./db.js").local_db();
const userRoute=require("./Routes/user.js");
const master_user_Route=require("./Routes/master_user.js");
const general=require("./Routes/general.js");
const payments=require("./Routes/payments.js");
const test=require("./Routes/test.js");
const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors());
// routing
app.get("/",(req,res)=>{
    res.send("ok")
    })
app.use("/user",userRoute)
app.use("/master_user",master_user_Route)
app.use("/general",general)
app.use("/payments",payments)
app.use("/test",test)
db.then((e)=>{
    console.log("db is connected")
})
.catch((error)=>{
    console.log("db is not connected")
    console.log(error)
})


const PORT=process.env.PORT || 5000;
app.listen(PORT,(error)=>{
    if(error){
        {"port is not started error is",error}
    }
    else{
       
        console.log("port is started",PORT)
        console.log("ENVIROMENT-",process.env.ENV)
    }
})
