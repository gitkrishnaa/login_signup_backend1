const mongoose = require('mongoose');
require('dotenv').config()
const MONGODB_LINK=process.env.LOCALHOST_MONGODB_LINK;
const CLOUD_MONGODB_LINK=process.env.CLOUD_MONGODB_LINK
const DB_NAME=process.env.DB_NAME;
console.log("MONGODB_LINK - ",MONGODB_LINK);
console.log("DB_NAME - ",DB_NAME);
// console.log(MONGODB_LINK,DB_NAME);

/*
note- how it work
i have designed it in two way
a- localhost mongo db
b-  cloud mongodb

for localhost-
see and change .env variable where you have two db link and db name

and check in app.js where db import where
local_db() is then ok else correct it like written down
const db=require("./db.js").local_db();



for cloud mongo db-
see and change .env variable where clould link will there

and check in app.js where db import where
cloud_db() is then ok else correct it like written down
const db=require("./db.js").cloud_db();


*/



function local_db(){
    const local_db1=mongoose.connect(MONGODB_LINK+DB_NAME);
    return local_db1;
}
function cloud_db(){

const cloud_db1=mongoose.connect(CLOUD_MONGODB_LINK);
    return cloud_db1;
}

module.exports.local_db=local_db;
module.exports.cloud_db=cloud_db;