
const express=require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const cors = require('cors');

// file improting
const db=require("./db.js").local_db();
const userRoute=require("./Routes/user.js");


const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors());
// routing
app.get("/",(req,res)=>{
    res.send("ok")
    })
app.use("/user",userRoute)


db.then((e)=>{
    console.log("db is connected")
})
.catch((error)=>{
    console.log("db is not connected")
    console.log(error)
})


const PORT=process.env.PORT || 4444;
app.listen(PORT,(error)=>{
    if(error){
        {"port is not started error is",error}
    }
    else{
       
        console.log("port is started",PORT)
    }
})
